function getErrorText(error) {
  const payload = error?.response?.data;

  if (payload === undefined || payload === null) {
    return String(error?.message || "");
  }

  if (typeof payload === "string") {
    return payload;
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload?.message || payload?.error || error?.message || "");
  }
}

export function getFriendlyApiError(error, feature = "") {
  console.error("API error:", error?.response?.data || error?.message || error);

  if (!error?.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  const errorText = getErrorText(error).toLowerCase();
  if (
    errorText.includes('relation "ratings" does not exist') ||
    errorText.includes("ratings does not exist")
  ) {
    return "Chức năng đánh giá chưa sẵn sàng. Vui lòng kiểm tra backend hoặc chạy migration.";
  }

  if (
    errorText.includes('relation "conversations" does not exist') ||
    errorText.includes("conversations does not exist")
  ) {
    return "Chức năng tin nhắn chưa sẵn sàng. Vui lòng kiểm tra backend hoặc chạy migration.";
  }

  if (
    errorText.includes("bảng người giao sách chưa sẵn sàng") ||
    errorText.includes('relation "deliverers" does not exist') ||
    errorText.includes("deliverers does not exist") ||
    errorText.includes("deliverer")
  ) {
    return "Chức năng người giao sách chưa sẵn sàng. Vui lòng kiểm tra backend hoặc chạy migration.";
  }

  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
