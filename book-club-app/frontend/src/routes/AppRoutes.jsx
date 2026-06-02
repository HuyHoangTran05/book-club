import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AddBookPage from "../pages/AddBookPage.jsx";
import BookListPage from "../pages/BookListPage.jsx";
import GuestRoute from "./GuestRoute.jsx";
import DelivererProfilePage from "../pages/DelivererProfilePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import MyBooksPage from "../pages/MyBooksPage.jsx";
import PointHistoryPage from "../pages/PointHistoryPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TransactionsPage from "../pages/TransactionsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/new" element={<AddBookPage />} />
        <Route path="/books/add" element={<AddBookPage />} />
        <Route path="/my-books" element={<MyBooksPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/deliverer-profile" element={<DelivererProfilePage />} />
        <Route path="/points" element={<Navigate to="/points/history" replace />} />
        <Route path="/points/history" element={<PointHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
