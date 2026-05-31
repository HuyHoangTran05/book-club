import { classNames } from "../../utils/classNames.js";

function Input({ className = "", ...props }) {
  return (
    <input
      className={classNames(
        "min-h-12 w-full rounded-2xl border border-[#d9e2d8] bg-white px-4 py-3 text-sm text-[#082d24] shadow-sm outline-none transition placeholder:text-[#98a59d] focus:border-[#064834] focus:ring-2 focus:ring-[#e7f1e8]",
        className
      )}
      {...props}
    />
  );
}

export default Input;
