import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getConversationErrorMessage,
  getConversationMessages,
  normalizeMessage,
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
  const messagesEndRef = useRef(null);

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

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((first, second) => {
      return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading, sortedMessages.length]);

  async function handleSendMessage(event, rawContent = messageText) {
    event?.preventDefault?.();

    if (isSending) {
      return;
    }

    const content = rawContent.trim();

    if (!content) {
      setError("Vui lòng nhập nội dung tin nhắn.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const createdMessage = normalizeMessage(await sendMessage(conversationId, { content }));
      setMessages((currentMessages) => {
        if (
          createdMessage.message_id &&
          currentMessages.some((message) => normalizeId(message.message_id) === createdMessage.message_id)
        ) {
          return currentMessages;
        }

        return [...currentMessages, createdMessage];
      });
      setMessageText("");
      scrollToBottom();
    } catch (sendError) {
      setError(getConversationErrorMessage(sendError, "Không thể gửi tin nhắn. Vui lòng thử lại."));
    } finally {
      setIsSending(false);
    }
  }

  function handleMessageKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(undefined, event.currentTarget.value);
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
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        ) : null}

        <form className="message-form" onSubmit={handleSendMessage}>
          <label htmlFor="message-content">Nội dung tin nhắn</label>
          <div>
            <textarea
              id="message-content"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={handleMessageKeyDown}
              disabled={isSending}
              placeholder="Nhập tin nhắn..."
              rows={3}
            />
            <Button type="submit" disabled={isSending || !messageText.trim()}>
              {isSending ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ConversationDetailPage;
