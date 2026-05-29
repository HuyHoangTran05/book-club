import { classNames } from "../../utils/classNames.js";

const variants = {
  primary: "bg-teal-600 text-white shadow-soft hover:bg-teal-700 focus:ring-teal-500",
  secondary: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-teal-500",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
  danger: "bg-rose-600 text-white shadow-soft hover:bg-rose-700 focus:ring-rose-500",
};

function Button({ children, className = "", variant = "primary", type = "button", disabled = false, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
