import Input from "./Input.jsx";

function FormField({ label, id, error, helperText, as = "input", className = "", children, ...props }) {
  const fieldId = id || props.name;
  const sharedClasses =
    "min-h-12 w-full rounded-2xl border border-[#d9e2d8] bg-white px-4 py-3 text-sm text-[#082d24] shadow-sm outline-none transition placeholder:text-[#98a59d] focus:border-[#064834] focus:ring-2 focus:ring-[#e7f1e8]";

  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="mb-2 block text-sm font-bold text-[#082d24]">{label}</span>
      {as === "textarea" ? (
        <textarea id={fieldId} className={`${sharedClasses} min-h-28 resize-y`} {...props} />
      ) : as === "select" ? (
        <select id={fieldId} className={sharedClasses} {...props}>
          {children}
        </select>
      ) : children ? (
        children
      ) : (
        <Input id={fieldId} {...props} />
      )}
      {helperText ? <span className="mt-1.5 block text-xs text-[#64736d]">{helperText}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export default FormField;
