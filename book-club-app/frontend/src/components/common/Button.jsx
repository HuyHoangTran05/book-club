import { classNames } from "../../utils/classNames.js";

const variants = {
  primary: "bg-[#064834] text-white shadow-soft hover:bg-[#033b2a] focus:ring-[#064834]",
  secondary: "bg-white text-[#064834] ring-1 ring-[#d9e2d8] hover:bg-[#e7f1e8] focus:ring-[#064834]",
  ghost: "bg-transparent text-[#064834] hover:bg-[#e7f1e8] focus:ring-[#064834]",
  danger: "bg-[#b42318] text-white shadow-soft hover:bg-[#8f1c13] focus:ring-[#b42318]",
};

function Button({ children, className = "", variant = "primary", type = "button", disabled = false, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
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
