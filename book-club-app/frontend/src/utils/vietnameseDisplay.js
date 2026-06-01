const displayMap = {
  "Dac Nhan Tam": "Đắc Nhân Tâm",
  "Nha Gia Kim": "Nhà Giả Kim",
  "Toi Thay Hoa Vang Tren Co Xanh": "Tôi thấy hoa vàng trên cỏ xanh",
  "De Men Phieu Luu Ky": "Dế Mèn Phiêu Lưu Ký",
  "Ky nang song": "Kỹ năng sống",
  "Ky nang": "Kỹ năng",
  "Tieu thuyet": "Tiểu thuyết",
  "Van hoc Viet Nam": "Văn học Việt Nam",
  "Van hoc": "Văn học",
  "Kinh te": "Kinh tế",
  "Triet hoc": "Triết học",
  "Khoa hoc": "Khoa học",
  "Cong nghe": "Công nghệ",
  "Lich su": "Lịch sử",
  "Tam ly hoc": "Tâm lý học",
  "Nguyen Van An": "Nguyễn Văn An",
  "Tran Thi Binh": "Trần Thị Bình",
  "Le Minh Chi": "Lê Minh Chi",
  "Nguyen Van A": "Nguyễn Văn A",
  "Nguyen Nhat Anh": "Nguyễn Nhật Ánh",
  "To Hoai": "Tô Hoài",
};

function hasVietnameseText(value) {
  return /[À-ỹĐđ]/.test(value);
}

function cleanValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

export function normalizeVietnameseText(value, fallback = "") {
  const cleanedValue = cleanValue(value);

  if (!cleanedValue) {
    return fallback;
  }

  if (displayMap[cleanedValue]) {
    return displayMap[cleanedValue];
  }

  if (hasVietnameseText(cleanedValue)) {
    return cleanedValue;
  }

  return cleanedValue;
}

export function displayBookTitle(value, fallback = "Chưa có tên sách") {
  return normalizeVietnameseText(value, fallback);
}

export function displayCategory(value, fallback = "Khác") {
  return normalizeVietnameseText(value, fallback);
}

export function displayPersonName(value, fallback = "Chưa rõ") {
  return normalizeVietnameseText(value, fallback);
}

export function displayAuthorName(value, fallback = "Chưa rõ tác giả") {
  return normalizeVietnameseText(value, fallback);
}

export function displayReason(reason, pointChange) {
  const rawReason = cleanValue(reason);
  const numericPointChange = Number(pointChange);

  if (!rawReason) {
    return "Lý do giao dịch";
  }

  if (hasVietnameseText(rawReason) || rawReason.includes(" ")) {
    return rawReason;
  }

  if (rawReason === "initial_register") {
    return "Điểm khởi đầu khi đăng ký";
  }

  if (rawReason === "permanent_exchange") {
    if (numericPointChange > 0) {
      return "Trao đổi sách thành công";
    }

    if (numericPointChange < 0) {
      return "Nhận sách qua trao đổi";
    }

    return "Trao đổi sách";
  }

  if (rawReason === "lending") {
    if (numericPointChange > 0) {
      return "Cho mượn sách thành công";
    }

    if (numericPointChange < 0) {
      return "Mượn sách thành công";
    }

    return "Giao dịch mượn sách";
  }

  if (rawReason === "lending_lend") {
    return "Cho mượn sách thành công";
  }

  if (rawReason === "lending_borrow") {
    return "Mượn sách thành công";
  }

  return rawReason.includes("_") ? "Lý do giao dịch" : rawReason;
}
