import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f4ea] px-6 py-10 text-center text-sm font-bold text-[#64736d]">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/books" replace />;
  }

  return children;
}

export default GuestRoute;
