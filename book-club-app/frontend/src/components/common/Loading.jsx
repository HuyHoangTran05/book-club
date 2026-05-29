function Loading({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
      {label}
    </div>
  );
}

export default Loading;
