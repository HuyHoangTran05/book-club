import { classNames } from "../../utils/classNames.js";

const statusStyles = {
  available: "bg-[#e7f1e8] text-[#0f7a4f] ring-[#b9dcc4]",
  reserved: "bg-[#f0e7b7] text-[#8a6500] ring-[#dfcf7a]",
  borrowed: "bg-[#e5f4f1] text-[#0b5c43] ring-[#b7ded4]",
  exchanged: "bg-[#f1eee3] text-[#64736d] ring-[#d9e2d8]",
  unavailable: "bg-slate-100 text-slate-600 ring-slate-200",
  pending: "bg-[#f0e7b7] text-[#8a6500] ring-[#dfcf7a]",
  completed: "bg-[#e7f1e8] text-[#0f7a4f] ring-[#b9dcc4]",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  positive: "bg-[#e7f1e8] text-[#0f7a4f] ring-[#b9dcc4]",
  negative: "bg-rose-50 text-rose-700 ring-rose-200",
  neutral: "bg-[#fbfaf3] text-[#64736d] ring-[#d9e2d8]",
};

const statusLabels = {
  available: "Sẵn sàng",
  reserved: "Đang giữ chỗ",
  borrowed: "Đang mượn",
  exchanged: "Đã trao đổi",
  unavailable: "Tạm ẩn",
  pending: "Đang chờ",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
  positive: "Tăng điểm",
  negative: "Trừ điểm",
  neutral: "Thông tin",
};

function formatLabel(value) {
  return statusLabels[value] || String(value).replace(/-/g, " ");
}

function Badge({ status = "neutral", children, className = "" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        statusStyles[status] || statusStyles.neutral,
        className
      )}
    >
      {children || formatLabel(status)}
    </span>
  );
}

export default Badge;
