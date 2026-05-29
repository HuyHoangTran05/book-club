import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AddBookPage from "../pages/AddBookPage.jsx";
import BookListPage from "../pages/BookListPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import PointHistoryPage from "../pages/PointHistoryPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TransactionPage from "../pages/TransactionPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<BookListPage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/add" element={<AddBookPage />} />
        <Route path="/my-books" element={<BookListPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/points" element={<Navigate to="/points/history" replace />} />
        <Route path="/points/history" element={<PointHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
