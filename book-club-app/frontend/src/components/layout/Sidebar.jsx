import { NavLink } from "react-router-dom";
import { classNames } from "../../utils/classNames.js";

const navigationItems = [
  { label: "Book List", to: "/books" },
  { label: "Add Book", to: "/books/add" },
  { label: "My Transactions", to: "/transactions" },
  { label: "Point History", to: "/points" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-slate-950/30 transition lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          "fixed left-0 top-0 z-50 h-full w-72 border-r border-white/70 bg-white/95 p-4 shadow-stitch transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:translate-x-0 lg:bg-white/65 lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-sm font-black text-slate-950">Navigation</p>
          <button className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "block rounded-lg px-4 py-3 text-sm font-bold transition",
                  isActive ? "bg-teal-600 text-white shadow-soft" : "text-slate-700 hover:bg-white hover:text-slate-950"
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
