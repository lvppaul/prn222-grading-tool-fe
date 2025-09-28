import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoute from "./router/ProtectedRoute";
import RoleBasedRoute from "./router/RoleBasedRoute";

import ExaminerDashboard from "./features/exams/pages/ExaminerDashboard";
import LecturerDashboard from "./features/grading/pages/LecturerDashboard";
import StatisticsPage from "./features/statistics/pages/StatisticsPage";
import Layout from "./components/Layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        {/* Examiner */}
        <Route
          path="/examiner"
          element={
            <RoleBasedRoute allowedRoles={["examiner"]}>
              <Layout>
                <ExaminerDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        {/* Lecturer */}
        <Route
          path="/lecturer"
          element={
            <RoleBasedRoute allowedRoles={["lecturer"]}>
              <Layout>
                <LecturerDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <RoleBasedRoute allowedRoles={["lecturer"]}>
              <Layout>
                <StatisticsPage />
              </Layout>
            </RoleBasedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
