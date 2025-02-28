// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackList from "./components/FeedbackList";
import Home from "./pages/Home";
import ViewTasks from "./pages/ViewTasks";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import FeedbackForm from "./components/FeedbackForm";
import ManageNotes from "./pages/ManageNotes";
import EditNote from "./pages/EditNote";
import TaskCalendar from "./pages/TaskCalendar";
import CalendarPage from "./pages/CalendarPage";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import Notes from "./pages/Notes";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view-tasks" element={<ViewTasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/task-calendar" element={<TaskCalendar />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin/feedbacks" element={<FeedbackList />} />
            <Route path="/manage-notes" element={<ManageNotes />} />
            <Route path="/edit-note/:id" element={<EditNote />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
