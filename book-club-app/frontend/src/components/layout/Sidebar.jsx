import { NavLink, useLocation } from "react-router-dom";
import { classNames } from "../../utils/classNames.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const navigationItems = [
  { label: "Khám phá sách", to: "/books" },
  { label: "Thêm sách", to: "/books/add" },
  { label: "Sách của tôi", to: "/my-books" },
  { label: "Giao dịch", to: "/transactions" },
  { label: "Tin nhắn", to: "/conversations" },
  { label: "Đăng ký giao sách", to: "/deliverer-profile" },
  { label: "Lịch sử điểm", to: "/points/history" },
  { label: "Đánh giá", to: "/ratings" },
  { label: "Hồ sơ cá nhân", to: "/profile" },
];

const hiddenAdminNavigationLabels = new Set([
  "Thêm sách",
  "Sách của tôi",
  "Giao dịch",
  "Tin nhắn",
  "Đăng ký giao sách",
  "Lịch sử điểm",
  "Đánh giá",
]);

const adminNavigationItems = [
  { label: "Bảng điều khiển", to: "/admin" },
  { label: "Quản lý thành viên", to: "/admin/members" },
  { label: "Giám sát giao dịch", to: "/admin/transactions" },
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

  if (itemPath === "/conversations") {
    return pathname === "/conversations" || pathname.startsWith("/conversations/");
  }

  if (itemPath === "/profile") {
    return pathname === "/profile";
  }

  return pathname === itemPath;
}

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const visibleNavigationItems = isAdmin
    ? navigationItems.filter((item) => !hiddenAdminNavigationLabels.has(item.label))
    : navigationItems;

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
          "fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto border-r border-[#d9e2d8] bg-[#fbfaf3]/95 p-3 pb-6 shadow-stitch transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:w-[220px] lg:min-w-[220px] lg:translate-x-0 lg:bg-transparent lg:shadow-none",
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
          {visibleNavigationItems.map((item) => (
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

        {isAdmin ? (
          <nav className="mt-4 space-y-2 border-t border-[#d9e2d8] pt-4">
            <p className="px-3.5 pb-1 text-xs font-black uppercase tracking-wide text-[#98a59d]">
              Quản trị
            </p>
            {adminNavigationItems.map((item) => (
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
        ) : null}
      </aside>
    </>
  );
}

export default Sidebar;
