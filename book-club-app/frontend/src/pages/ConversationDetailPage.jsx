import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getConversationErrorMessage,
  getConversationMessages,
  sendMessage,
} from "../services/conversationService.js";
import { getCurrentUser as getStoredCurrentUser } from "../utils/auth.js";
import { displayPersonName } from "../utils/vietnameseDisplay.js";
import "./ConversationsPage.css";

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function getUserId(user = {}) {
  return normalizeId(user.member_id ?? user.memberId ?? user.id);
}

function getSenderName(message) {
  return displayPersonName(
    message.sender?.full_name || message.sender?.fullName || message.sender?.name || message.sender?.email,
    "Thành viên"
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ConversationDetailPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const currentUserId = normalizeId(getUserId(user || getStoredCurrentUser()));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  async function loadMessages() {
    setIsLoading(true);
    setError("");

    try {
      const result = await getConversationMessages(conversationId);
      setMessages(result);
    } catch (loadError) {
      setError(getConversationErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((first, second) => {
      return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    });
  }, [messages]);

  async function handleSendMessage(event) {
    event.preventDefault();
    const content = messageText.trim();

    if (!content) {
      setError("Vui lòng nhập nội dung tin nhắn.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      await sendMessage(conversationId, { content });
      setMessageText("");
      const result = await getConversationMessages(conversationId);
      setMessages(result);
    } catch (sendError) {
      setError(getConversationErrorMessage(sendError, "Không thể gửi tin nhắn. Vui lòng thử lại."));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="conversations-page">
      <header className="conversations-header conversations-detail-header">
        <div>
          <p>Tin nhắn</p>
          <h1>Chi tiết trò chuyện</h1>
          <span>Gửi tin nhắn và làm mới cuộc trò chuyện sau mỗi lần gửi.</span>
        </div>
        <Link className="conversation-back-link" to="/conversations">
          Quay lại
        </Link>
      </header>

      {error ? <Alert type="error">{error}</Alert> : null}

      <Card className="conversation-thread">
        {isLoading ? <p className="conversations-state-inline">Đang tải tin nhắn...</p> : null}

        {!isLoading && sortedMessages.length === 0 ? (
          <div className="conversations-state-inline">
            <h2>Chưa có tin nhắn.</h2>
            <p>Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.</p>
          </div>
        ) : null}

        {!isLoading && sortedMessages.length > 0 ? (
          <div className="message-list">
            {sortedMessages.map((message) => {
              const isMine = normalizeId(message.sender_id) === currentUserId;

              return (
                <article className={isMine ? "message-bubble message-bubble-mine" : "message-bubble"} key={message.message_id}>
                  <p>{message.content || "Tin nhắn trống"}</p>
                  <span>
                    {isMine ? "Bạn" : getSenderName(message)} · {formatDate(message.created_at)}
                  </span>
                </article>
              );
            })}
          </div>
        ) : null}

        <form className="message-form" onSubmit={handleSendMessage}>
          <label htmlFor="message-content">Nội dung tin nhắn</label>
          <div>
            <textarea
              id="message-content"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              disabled={isSending}
              placeholder="Nhập tin nhắn..."
              rows={3}
            />
            <Button type="submit" disabled={isSending}>
              {isSending ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ConversationDetailPage;
