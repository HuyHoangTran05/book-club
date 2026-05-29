import { Link } from "react-router-dom";
import { Button, Badge } from "../common/index.js";

function Header({ currentUser, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="lg:hidden" onClick={onMenuClick}>
            Menu
          </Button>
          <Link to="/books" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600 text-lg font-black text-white shadow-soft">
              BC
            </span>
            <div>
              <p className="text-base font-black text-slate-950 sm:text-lg">Book Club Exchange</p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">Share stories, trade books, earn points</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900">{currentUser.fullName}</p>
            <p className="text-xs text-slate-500">Mock current user</p>
          </div>
          <Badge status="completed">{currentUser.points} points</Badge>
          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/login">
              Login
            </Link>
            <Link className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
