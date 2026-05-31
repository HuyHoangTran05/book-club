import { classNames } from "../../utils/classNames.js";

const styles = {
  success: "border-[#b9dcc4] bg-[#e7f1e8] text-[#0f7a4f]",
  info: "border-[#d9e2d8] bg-[#fbfaf3] text-[#064834]",
  warning: "border-[#dfcf7a] bg-[#f0e7b7] text-[#8a6500]",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

function Alert({ children, type = "info", className = "" }) {
  return (
    <div className={classNames("rounded-2xl border px-4 py-3 text-sm font-bold", styles[type] || styles.info, className)}>
      {children}
    </div>
  );
}

export default Alert;
