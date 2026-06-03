import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AddBookPage from "../pages/AddBookPage.jsx";
import BookListPage from "../pages/BookListPage.jsx";
import ConversationDetailPage from "../pages/ConversationDetailPage.jsx";
import ConversationsPage from "../pages/ConversationsPage.jsx";
import GuestRoute from "./GuestRoute.jsx";
import DelivererProfilePage from "../pages/DelivererProfilePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import MyBooksPage from "../pages/MyBooksPage.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";
import PointHistoryPage from "../pages/PointHistoryPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import RatingsPage from "../pages/RatingsPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TransactionsPage from "../pages/TransactionsPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminMembersPage from "../pages/AdminMembersPage.jsx";
import AdminTransactionsPage from "../pages/AdminTransactionsPage.jsx";

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
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/conversations/:conversationId" element={<ConversationDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/deliverer-profile" element={<DelivererProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/points" element={<Navigate to="/points/history" replace />} />
        <Route path="/points/history" element={<PointHistoryPage />} />
      </Route>

      <Route
        element={
          <AdminRoute>
            <MainLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/members" element={<AdminMembersPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
