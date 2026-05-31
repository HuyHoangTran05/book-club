function Loading({ label = "Đang tải dữ liệu..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#d9e2d8] bg-white px-4 py-3 text-sm font-bold text-[#64736d] shadow-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d9e2d8] border-t-[#064834]" />
      {label}
    </div>
  );
}

export default Loading;
