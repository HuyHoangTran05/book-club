import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getConversationErrorMessage,
  getConversationMessages,
  getConversations,
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
  const otherUser = conversation.otherUser || conversation.otherParticipant || {};
  return displayPersonName(otherUser.full_name || otherUser.fullName || otherUser.name, otherUser.email || "Thành viên");
}

function getParticipantContact(conversation) {
  const otherUser = conversation.otherUser || conversation.otherParticipant || {};
  return otherUser.email || otherUser.phone || "Chưa có thông tin liên hệ";
}

function getPreviewText(conversation) {
  return conversation.lastMessage?.content || conversation.last_message || "Chưa có tin nhắn";
}

function getPreviewTime(conversation) {
  return conversation.lastMessage?.created_at || conversation.updated_at || conversation.created_at;
}

function getAvatarText(conversation) {
  const otherUser = conversation.otherUser || conversation.otherParticipant || {};
  const name = getParticipantName(conversation);
  const source = name !== "Thành viên" ? name : otherUser.email || "TV";
  const words = source.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getLatestMessage(messages = []) {
  if (!messages.length) {
    return null;
  }

  return [...messages].sort((first, second) => {
    const firstTime = new Date(first.created_at || 0).getTime();
    const secondTime = new Date(second.created_at || 0).getTime();

    return secondTime - firstTime;
  })[0];
}

function ConversationsPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = getUserId(user || getStoredCurrentUser());

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getConversations(currentUserId);

        // Backend currently does not return lastMessage in GET /api/conversations,
        // so we fetch messages per conversation to build the preview.
        const conversationsWithPreview = await Promise.all(
          result.map(async (conversation) => {
            if (conversation.lastMessage || !conversation.conversation_id) {
              return conversation;
            }

            try {
              const messages = await getConversationMessages(conversation.conversation_id);
              const latestMessage = getLatestMessage(messages);

              return latestMessage
                ? {
                    ...conversation,
                    lastMessage: latestMessage,
                    last_message: latestMessage.content || "",
                  }
                : conversation;
            } catch (messageError) {
              console.error("Conversation preview error:", messageError.response?.data || messageError.message);
              return conversation;
            }
          })
        );

        if (isMounted) {
          setConversations(conversationsWithPreview);
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
  }, [currentUserId]);

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
                {getAvatarText(conversation)}
              </div>
              <div>
                <h2>{getParticipantName(conversation)}</h2>
                <p>{getParticipantContact(conversation)}</p>
                <span className="conversation-preview" title={getPreviewText(conversation)}>
                  {getPreviewText(conversation)}
                </span>
              </div>
              <time>{formatDate(getPreviewTime(conversation))}</time>
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default ConversationsPage;
