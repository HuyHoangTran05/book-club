export const statusLabels = {
  available: "Sẵn sàng",
  reserved: "Đang giữ chỗ",
  borrowed: "Đang mượn",
  exchanged: "Đã trao đổi",
  unavailable: "Tạm ẩn",
};

export const conditionLabels = {
  new: "Mới",
  good: "Còn tốt",
  fair: "Đã qua sử dụng",
  worn: "Hơi cũ",
};

export const exchangeTypeLabels = {
  permanent: "Trao đổi vĩnh viễn",
  lending: "Cho mượn",
  both: "Trao đổi hoặc cho mượn",
};

export const categoryOptions = [
  "Tiểu thuyết",
  "Văn học Việt Nam",
  "Văn học nước ngoài",
  "Kinh tế",
  "Triết học",
  "Khoa học",
  "Công nghệ",
  "Kỹ năng",
  "Lịch sử",
  "Tâm lý học",
];

const categoryLabelMap = {
  "Tieu thuyet": "Tiểu thuyết",
  "Tieu thuyết": "Tiểu thuyết",
  "Tiểu thuyết": "Tiểu thuyết",
  "Van hoc": "Văn học",
  "Văn học": "Văn học",
  "Van hoc Viet Nam": "Văn học Việt Nam",
  "Văn học Việt Nam": "Văn học Việt Nam",
  "Van hoc nuoc ngoai": "Văn học nước ngoài",
  "Văn học nước ngoài": "Văn học nước ngoài",
  "Kinh te": "Kinh tế",
  "Kinh tế": "Kinh tế",
  "Triet hoc": "Triết học",
  "Triết học": "Triết học",
  "Khoa hoc": "Khoa học",
  "Khoa học": "Khoa học",
  "Cong nghe": "Công nghệ",
  "Công nghệ": "Công nghệ",
  "Ky nang": "Kỹ năng",
  "Ky nang song": "Kỹ năng",
  "Kỹ năng sống": "Kỹ năng",
  "Kỹ năng": "Kỹ năng",
  "Lich su": "Lịch sử",
  "Lịch sử": "Lịch sử",
  "Tam ly hoc": "Tâm lý học",
  "Tâm lý học": "Tâm lý học",
};

const displayTextMap = {
  "Nha Gia Kim": "Nhà Giả Kim",
  "Toi Thay Hoa Vang Tren Co Xanh": "Tôi thấy hoa vàng trên cỏ xanh",
  "Dac Nhan Tam": "Đắc Nhân Tâm",
  "Tu Duy Nhanh Va Cham": "Tư Duy Nhanh Và Chậm",
  "Nguyen Nhat Anh": "Nguyễn Nhật Ánh",
  "Nguyen Van An": "Nguyễn Văn An",
  "Tran Thi Binh": "Trần Thị Bình",
  "Le Minh Chi": "Lê Minh Chi",
  "NXB Van Hoc": "NXB Văn Học",
  "NXB Tre": "NXB Trẻ",
  "NXB Tong Hop": "NXB Tổng Hợp",
  "NXB The Gioi": "NXB Thế Giới",
  Vietnamese: "Tiếng Việt",
  English: "Tiếng Anh",
  "Bia hoi cu, ruot sach sach.": "Bìa hơi cũ, ruột sách sạch.",
  "Muon toi da 14 ngay.": "Mượn tối đa 14 ngày.",
  "Muon toi da 14 ngay": "Mượn tối đa 14 ngày",
  "San sang trao doi vinh vien.": "Sẵn sàng trao đổi vĩnh viễn.",
  "Sach tieng Anh, can giu sach can than.": "Sách tiếng Anh, cần giữ sách cẩn thận.",
  "Co the hen giao trong khu vuc Dong Da.": "Có thể hẹn giao trong khu vực Đống Đa.",
  "Cau chuyen ve hanh trinh tim kho bau va uoc mo ca nhan.":
    "Câu chuyện về hành trình tìm kho báu và ước mơ cá nhân.",
  "Truyen dai ve tuoi tho, tinh ban va gia dinh.": "Truyện dài về tuổi thơ, tình bạn và gia đình.",
  "Sach kinh dien ve giao tiep va ung xu.": "Sách kinh điển về giao tiếp và ứng xử.",
  "Nguyen tac viet ma nguon ro rang, de bao tri.": "Nguyên tắc viết mã nguồn rõ ràng, dễ bảo trì.",
  "Phan tich hai he thong tu duy trong ra quyet dinh.":
    "Phân tích hai hệ thống tư duy trong ra quyết định.",
};

export function normalizeDisplayText(value, fallback = "") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return displayTextMap[value] || value;
}

export function normalizeCategoryLabel(value, fallback = "Chưa phân loại") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return categoryLabelMap[value] || value;
}

export function getStatusLabel(value) {
  return statusLabels[value] || normalizeDisplayText(value, value || "Sẵn sàng");
}

export function getConditionLabel(value) {
  return conditionLabels[value] || normalizeDisplayText(value, value || "Còn tốt");
}

export function getExchangeTypeLabel(value) {
  return exchangeTypeLabels[value] || normalizeDisplayText(value, value || "Trao đổi hoặc cho mượn");
}

export function isHiddenBookStatus(status) {
  return status === "unavailable";
}
