import { Link } from "react-router-dom";
import { Button, Badge } from "../common/index.js";

function Header({ currentUser, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d9e2d8] bg-[#fbfaf3]/88 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
            <p className="text-sm font-bold text-[#082d24]">{currentUser.fullName}</p>
            <p className="text-xs text-[#64736d]">Thành viên cộng đồng</p>
          </div>
          <Badge status="completed">{currentUser.points} điểm</Badge>
          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-xl px-3 py-2 text-sm font-semibold text-[#064834] hover:bg-[#e7f1e8]" to="/login">
              Đăng nhập
            </Link>
            <Link className="rounded-xl bg-[#064834] px-3 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[#033b2a]" to="/register">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
