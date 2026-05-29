import Input from "./Input.jsx";

function FormField({ label, id, error, helperText, as = "input", className = "", children, ...props }) {
  const fieldId = id || props.name;
  const sharedClasses =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
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
      {helperText ? <span className="mt-1.5 block text-xs text-slate-500">{helperText}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export default FormField;
