import { Link, useNavigate } from "react-router-dom";
import { Button, Badge } from "../common/index.js";

function Header({ currentUser, onLogout, onMenuClick }) {
  const navigate = useNavigate();
  const points = currentUser?.points ?? currentUser?.pointBalance ?? currentUser?.point_balance ?? 20;

  function handleLogout() {
    onLogout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#d9e2d8] bg-[#fbfaf3]/88 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-[1536px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="lg:hidden" onClick={onMenuClick}>
            Mở menu
          </Button>
          <Link to="/" className="flex items-center gap-3" aria-label="Cộng Đồng Sách trang chủ">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#064834] text-lg font-black text-white shadow-soft">
              S
            </span>
            <div>
              <p className="text-base font-black text-[#082d24] sm:text-lg">Cộng Đồng Sách</p>
              <p className="hidden text-xs font-medium text-[#64736d] sm:block">Chia sẻ sách, kết nối thành viên, tích lũy điểm</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-[#082d24]">{currentUser?.fullName || currentUser?.full_name || currentUser?.name || "Thành viên"}</p>
            <p className="text-xs text-[#64736d]">Thành viên cộng đồng</p>
          </div>
          <Badge status="completed">{points} điểm</Badge>
          <button className="rounded-xl px-3 py-2 text-sm font-semibold text-[#064834] hover:bg-[#e7f1e8]" type="button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
