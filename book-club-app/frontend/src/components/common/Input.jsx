import { classNames } from "../../utils/classNames.js";

function Input({ className = "", ...props }) {
  return (
    <input
      className={classNames(
        "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100",
        className
      )}
      {...props}
    />
  );
}

export default Input;
