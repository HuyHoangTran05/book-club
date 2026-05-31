import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import MainContainer from "../components/layout/MainContainer.jsx";
import { mockCurrentUser } from "../data/mockData.js";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ea] text-[#082d24]">
      <Header currentUser={mockCurrentUser} onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <MainContainer>
          <Outlet />
        </MainContainer>
      </div>
    </div>
  );
}

export default MainLayout;
