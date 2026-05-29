import { classNames } from "../../utils/classNames.js";

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

function Alert({ children, type = "info", className = "" }) {
  return (
    <div className={classNames("rounded-lg border px-4 py-3 text-sm font-medium", styles[type] || styles.info, className)}>
      {children}
    </div>
  );
}

export default Alert;
