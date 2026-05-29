import { classNames } from "../../utils/classNames.js";

const statusStyles = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  reserved: "bg-amber-50 text-amber-700 ring-amber-200",
  borrowed: "bg-sky-50 text-sky-700 ring-sky-200",
  exchanged: "bg-violet-50 text-violet-700 ring-violet-200",
  unavailable: "bg-slate-100 text-slate-600 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negative: "bg-rose-50 text-rose-700 ring-rose-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatLabel(value) {
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
