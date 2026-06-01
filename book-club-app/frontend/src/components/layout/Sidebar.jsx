import { NavLink, useLocation } from "react-router-dom";
import { classNames } from "../../utils/classNames.js";

const navigationItems = [
  { label: "Khám phá sách", to: "/books" },
  { label: "Thêm sách", to: "/books/add" },
  { label: "Sách của tôi", to: "/my-books" },
  { label: "Giao dịch", to: "/transactions" },
  { label: "Lịch sử điểm", to: "/points/history" },
];

function isActiveRoute(itemPath, pathname) {
  if (itemPath === "/books") {
    return pathname === "/books";
  }

  if (itemPath === "/books/add") {
    return pathname === "/books/add" || pathname === "/books/new";
  }

  if (itemPath === "/points/history") {
    return pathname === "/points" || pathname === "/points/history";
  }

  return pathname === itemPath;
}

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-[#082d24]/35 transition lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-[#d9e2d8] bg-[#fbfaf3]/95 p-3 shadow-stitch transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:w-[220px] lg:min-w-[220px] lg:translate-x-0 lg:bg-transparent lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-sm font-black text-[#082d24]">Điều hướng</p>
          <button className="rounded-xl px-3 py-2 text-sm font-semibold text-[#64736d] hover:bg-[#e7f1e8]" onClick={onClose}>
            Đóng
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={() =>
                classNames(
                  "block whitespace-nowrap rounded-xl px-3.5 py-3 text-[15px] font-bold transition",
                  isActiveRoute(item.to, location.pathname)
                    ? "bg-[#064834] text-white shadow-soft"
                    : "text-[#64736d] hover:bg-white hover:text-[#082d24]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
