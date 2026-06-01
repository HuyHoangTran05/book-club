import { useEffect, useMemo, useState } from "react";
import { Badge, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getPointHistory } from "../services/pointService.js";
import { getCurrentUser as getStoredCurrentUser } from "../utils/auth.js";

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
  return fallbackUser?.points ?? fallbackUser?.pointBalance ?? fallbackUser?.point_balance ?? null;
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

        if (isMounted) {
          setItems(result.items);
          setCurrentPoints(result.currentPoints ?? getUserPoints(user));
        }
      } catch (loadError) {
        console.error("Point history error:", loadError.response?.data || loadError.message);

        if (isMounted) {
          setError("Không thể tải lịch sử điểm. Vui lòng thử lại.");
          setCurrentPoints(getUserPoints(user));
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

  const currentPointsText = currentPoints === null || currentPoints === undefined ? "-- điểm" : `${currentPoints}`;

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
        <Card className="bg-[#064834] text-white">
          <p className="text-sm font-semibold text-[#d9f2e4]">Điểm hiện tại</p>
          <p className="mt-2 text-5xl font-black">{currentPointsText}</p>
          <p className="mt-2 text-sm text-[#d9f2e4]">điểm có thể dùng cho giao dịch mới</p>
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
                  <p className="font-bold text-[#082d24]">
                    {item.transaction_id ? `Giao dịch #${item.transaction_id}` : "Không gắn giao dịch"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-[#64736d] md:hidden">Thay đổi</p>
                  <Badge status={getPointBadgeStatus(item.point_change)}>{formatPointChange(item.point_change)} điểm</Badge>
                </div>
                <div>
                  <p className="font-semibold text-[#64736d] md:hidden">Lý do</p>
                  <p className="leading-6 text-[#64736d]">{item.reason}</p>
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
