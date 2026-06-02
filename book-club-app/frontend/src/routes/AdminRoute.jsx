import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f4ea] px-6 py-10 text-center text-sm font-bold text-[#64736d]">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/books" replace />;
  }

  return children;
}

export default AdminRoute;
