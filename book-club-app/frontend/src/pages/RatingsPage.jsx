import { useEffect, useState } from "react";
import { Alert, Badge, Card } from "../components/common/index.js";
import {
  getMyGivenRatings,
  getMyReceivedRatings,
  getRatingErrorMessage,
} from "../services/ratingService.js";
import { displayPersonName } from "../utils/vietnameseDisplay.js";
import "./RatingsPage.css";

function getPersonName(person) {
  return displayPersonName(person?.full_name || person?.fullName || person?.name || person?.email, "Thành viên");
}

function formatDate(value) {
  if (!value) {
    return "Chưa rõ";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa rõ" : new Intl.DateTimeFormat("vi-VN").format(date);
}

function RatingsPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [error, setError] = useState("");
  const [givenRatings, setGivenRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [receivedRatings, setReceivedRatings] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadRatings() {
      setIsLoading(true);
      setError("");

      try {
        const [received, given] = await Promise.all([getMyReceivedRatings(), getMyGivenRatings()]);

        if (isMounted) {
          setReceivedRatings(received);
          setGivenRatings(given);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getRatingErrorMessage(loadError, "Không thể tải danh sách đánh giá. Vui lòng thử lại."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRatings();

    return () => {
      isMounted = false;
    };
  }, []);

  const ratings = activeTab === "received" ? receivedRatings : givenRatings;

  return (
    <div className="ratings-page">
      <header className="ratings-header">
        <p>Uy tín cộng đồng</p>
        <h1>Đánh giá</h1>
        <span>Theo dõi đánh giá bạn nhận được và những đánh giá bạn đã gửi sau giao dịch.</span>
      </header>

      <div className="ratings-tabs" role="tablist" aria-label="Loại đánh giá">
        <button type="button" className={activeTab === "received" ? "active" : ""} onClick={() => setActiveTab("received")}>
          Đánh giá tôi nhận được
        </button>
        <button type="button" className={activeTab === "given" ? "active" : ""} onClick={() => setActiveTab("given")}>
          Đánh giá tôi đã gửi
        </button>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      {isLoading ? (
        <Card className="ratings-state" aria-live="polite">
          Đang tải đánh giá...
        </Card>
      ) : null}

      {!isLoading && !error && ratings.length === 0 ? (
        <Card className="ratings-state">
          <h2>Chưa có đánh giá.</h2>
          <p>Đánh giá sau giao dịch sẽ hiển thị tại đây.</p>
        </Card>
      ) : null}

      {!isLoading && ratings.length > 0 ? (
        <section className="ratings-list" aria-label="Danh sách đánh giá">
          {ratings.map((rating) => (
            <Card className="rating-card" key={rating.rating_id || `${rating.transaction_id}-${rating.rated_member_id}`}>
              <div>
                <Badge status="completed">{rating.score}/5 điểm</Badge>
                <h2>{activeTab === "received" ? getPersonName(rating.rater) : getPersonName(rating.ratedMember)}</h2>
                <p>{rating.comment || "Không có nhận xét."}</p>
              </div>
              <span>{formatDate(rating.created_at)}</span>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default RatingsPage;
