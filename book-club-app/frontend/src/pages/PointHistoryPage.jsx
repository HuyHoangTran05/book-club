import { useEffect, useMemo, useState } from "react";
import { Badge, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getCurrentUser as fetchCurrentUser } from "../services/authService.js";
import { getPointHistory } from "../services/pointService.js";
import { getCurrentUser as getStoredCurrentUser } from "../utils/auth.js";
import { displayReason } from "../utils/vietnameseDisplay.js";
import "./PointHistoryPage.css";

function getPointBadgeStatus(pointChange) {
  if (pointChange > 0) {
    return "positive";
  }

  if (pointChange < 0) {
    return "negative";
  }

  return "neutral";
}

function formatPointChange(pointChange) {
  const numericPointChange = Number(pointChange);

  if (numericPointChange > 0) {
    return `+${numericPointChange}`;
  }

  return String(numericPointChange);
}

function formatTransactionLabel(transactionId) {
  if (!transactionId) {
    return "Không gắn giao dịch";
  }

  return `Giao dịch #${String(transactionId).slice(0, 8)}`;
}

function formatDate(value) {
  if (!value) {
    return "Chưa rõ";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getUserPoints(user) {
  const fallbackUser = user || getStoredCurrentUser();
  return fallbackUser?.point_balance ?? fallbackUser?.pointBalance ?? fallbackUser?.points ?? null;
}

function normalizePointValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function sumPointChanges(historyItems = []) {
  return historyItems.reduce((total, item) => {
    const pointChange = Number(item.point_change ?? item.pointChange ?? 0);
    return Number.isFinite(pointChange) ? total + pointChange : total;
  }, 0);
}

function resolveCurrentPoints(apiCurrentPoints, historyItems, currentUser) {
  const apiPoints = normalizePointValue(apiCurrentPoints);

  if (apiPoints !== null) {
    return apiPoints;
  }

  const authUserPoints = normalizePointValue(getUserPoints(currentUser));

  if (authUserPoints !== null) {
    return authUserPoints;
  }

  const storedUserPoints = normalizePointValue(getUserPoints(getStoredCurrentUser()));

  if (storedUserPoints !== null) {
    return storedUserPoints;
  }

  if (historyItems.length > 0) {
    return sumPointChanges(historyItems);
  }

  return null;
}

function PointHistoryPage() {
  const { user } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPointHistory() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getPointHistory();
        let latestUser = user;

        try {
          latestUser = await fetchCurrentUser();
        } catch (profileError) {
          console.error("Current user refresh error:", profileError.response?.data || profileError.message);
        }

        if (isMounted) {
          setItems(result.items);
          setCurrentPoints(resolveCurrentPoints(result.currentPoints, result.items, latestUser));
        }
      } catch (loadError) {
        console.error("Point history error:", loadError.response?.data || loadError.message);

        if (isMounted) {
          setError("Không thể tải lịch sử điểm. Vui lòng thử lại.");
          setCurrentPoints(resolveCurrentPoints(null, [], user));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPointHistory();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const sortedItems = useMemo(() => {
    return [...items].sort((first, second) => {
      return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
    });
  }, [items]);

  const normalizedCurrentPoints = normalizePointValue(currentPoints);
  const currentPointsText = normalizedCurrentPoints === null ? "-- điểm" : `${normalizedCurrentPoints} điểm`;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-extrabold text-[#c9ad2e]">Ví điểm thưởng</p>
          <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
            Lịch sử điểm
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
            Theo dõi điểm thưởng của bạn trong quá trình chia sẻ và trao đổi sách.
          </p>
        </div>
        <Card className="point-summary-card">
          <p className="point-summary-title">Điểm hiện tại</p>
          <p className="point-summary-value" aria-live="polite">{currentPointsText}</p>
          <p className="point-summary-subtitle">điểm có thể dùng cho giao dịch mới</p>
        </Card>
      </div>

      {isLoading ? (
        <Card className="text-center text-sm font-bold text-[#64736d]" aria-live="polite">
          Đang tải lịch sử điểm...
        </Card>
      ) : null}

      {!isLoading && error ? (
        <Card className="text-center" role="alert">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Không thể tải lịch sử điểm</h2>
          <p className="mt-2 text-[#64736d]">{error}</p>
        </Card>
      ) : null}

      {!isLoading && !error && sortedItems.length === 0 ? (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Chưa có lịch sử điểm.</h2>
        </Card>
      ) : null}

      {!isLoading && !error && sortedItems.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="hidden grid-cols-[170px_1fr_130px_1.4fr] gap-4 border-b border-[#d9e2d8] bg-[#fbfaf3] px-6 py-4 text-xs font-black text-[#64736d] md:grid">
            <span>Thời gian</span>
            <span>Giao dịch</span>
            <span>Thay đổi</span>
            <span>Lý do</span>
          </div>
          <div className="divide-y divide-[#d9e2d8]">
            {sortedItems.map((item) => (
              <div key={item.id} className="grid gap-3 px-6 py-5 text-sm md:grid-cols-[170px_1fr_130px_1.4fr] md:items-center md:gap-4">
                <div>
                  <p className="font-semibold text-[#64736d] md:hidden">Thời gian</p>
                  <p className="font-bold text-[#082d24]">{formatDate(item.created_at)}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#64736d] md:hidden">Giao dịch</p>
                  <p className="font-bold text-[#082d24]">{formatTransactionLabel(item.transaction_id)}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-[#64736d] md:hidden">Thay đổi</p>
                  <Badge status={getPointBadgeStatus(item.point_change)}>{formatPointChange(item.point_change)} điểm</Badge>
                </div>
                <div>
                  <p className="font-semibold text-[#64736d] md:hidden">Lý do</p>
                  <p className="leading-6 text-[#64736d]">{displayReason(item.reason, item.point_change)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default PointHistoryPage;
