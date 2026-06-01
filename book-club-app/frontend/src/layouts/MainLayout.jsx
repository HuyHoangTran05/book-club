import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import MainContainer from "../components/layout/MainContainer.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6f4ea] text-[#082d24]">
      <Header currentUser={user} onLogout={logout} onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1536px]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <MainContainer>
          <Outlet />
        </MainContainer>
      </div>
    </div>
  );
}

export default MainLayout;
