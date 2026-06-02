import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Card } from "../components/common/index.js";
import { getConversationErrorMessage, getConversations } from "../services/conversationService.js";
import { displayPersonName } from "../utils/vietnameseDisplay.js";
import "./ConversationsPage.css";

function formatDate(value) {
  if (!value) {
    return "Chưa rõ";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa rõ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getParticipantName(conversation) {
  return displayPersonName(conversation.otherParticipant?.full_name, conversation.otherParticipant?.email || "Thành viên");
}

function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getConversations();

        if (isMounted) {
          setConversations(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getConversationErrorMessage(loadError, "Không thể tải danh sách tin nhắn. Vui lòng thử lại."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((first, second) => {
      return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
    });
  }, [conversations]);

  return (
    <div className="conversations-page">
      <header className="conversations-header">
        <p>Kết nối thành viên</p>
        <h1>Tin nhắn</h1>
        <span>Trao đổi trực tiếp với chủ sách và các thành viên trong cộng đồng.</span>
      </header>

      {error ? <Alert type="error">{error}</Alert> : null}

      {isLoading ? (
        <Card className="conversations-state" aria-live="polite">
          Đang tải danh sách tin nhắn...
        </Card>
      ) : null}

      {!isLoading && !error && sortedConversations.length === 0 ? (
        <Card className="conversations-state">
          <h2>Chưa có cuộc trò chuyện nào.</h2>
          <p>Khi bạn liên hệ chủ sách, cuộc trò chuyện sẽ hiển thị tại đây.</p>
        </Card>
      ) : null}

      {!isLoading && sortedConversations.length > 0 ? (
        <section className="conversation-list" aria-label="Danh sách cuộc trò chuyện">
          {sortedConversations.map((conversation) => (
            <Link
              className="conversation-item"
              key={conversation.conversation_id}
              to={`/conversations/${conversation.conversation_id}`}
            >
              <div className="conversation-avatar" aria-hidden="true">
                {getParticipantName(conversation).slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2>{getParticipantName(conversation)}</h2>
                <p>{conversation.otherParticipant?.email || conversation.otherParticipant?.phone || "Chưa có thông tin liên hệ"}</p>
                <span>{conversation.last_message || "Chưa có tin nhắn"}</span>
              </div>
              <time>{formatDate(conversation.updated_at)}</time>
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default ConversationsPage;
