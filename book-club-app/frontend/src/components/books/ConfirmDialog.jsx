import { Button } from "../common/index.js";

function ConfirmDialog({ isOpen, isLoading = false, onCancel, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082d24]/45 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-[#d9e2d8] bg-white p-6 shadow-stitch">
        <h2 className="text-2xl font-extrabold text-[#033b2a]">Xóa sách</h2>
        <p className="mt-3 text-sm leading-6 text-[#64736d]">
          Bạn có chắc muốn xóa cuốn sách này không? Sau khi xóa, sách sẽ không còn hiển thị trong danh sách của bạn.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Đang xóa..." : "Xóa sách"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
