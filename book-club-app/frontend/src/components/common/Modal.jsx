import Button from "./Button.jsx";

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-stitch">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <Button variant="ghost" className="px-3 py-1.5" onClick={onClose}>
            Đóng
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
