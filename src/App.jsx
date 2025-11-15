import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";

import ProtectedRoute from "./router/ProtectedRoute";
import RoleBasedRoute from "./router/RoleBasedRoute";
import ExaminerDashboard from "./features/exams/pages/ExaminerDashboard";
import LecturerDashboard from "./features/grading/pages/LecturerDashboard";
import StatisticsPage from "./features/statistics/pages/StatisticsPage";
import Layout from "./components/Layout/Layout";
import GradingPage from "./features/grading/pages/GradingPage";
import LecturerLayout from "./components/Layout/Lecturer/LecturerLayout";
import ModeratorLayout from "./components/Layout/Moderator/ModeratorLayout";
import ModeratorSubmissions from "./features/submissions/pages/ModeratorSubmissions";
import SemesterDashboard from "./features/submissions/pages/SemesterDashboard";
import ExamDashboard from "./features/submissions/pages/ExamDashboard";
import SubmissionDetail from "./features/submissions/pages/SubmissionDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/auth/login" element={<LoginPage />} />

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
            // <RoleBasedRoute allowedRoles={["lecturer"]}>
                <LecturerLayout />
            // </RoleBasedRoute>
          }
        >
          <Route index element={<LecturerDashboard />} />
          <Route path="grading" element={<GradingPage />} />
        </Route>
        
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

        {/* Moderator */}
        <Route
          path="/moderator"
          element={
            // <RoleBasedRoute allowedRoles={["moderator"]}>
                <ModeratorLayout />
            // </RoleBasedRoute>
          }
        >
            <Route path="semesters" element={<SemesterDashboard />} />
            <Route path="exams/:semester" element={<ExamDashboard />} />
            <Route path="submissions/:semester/:examId" element={<ModeratorSubmissions />} />
            <Route path="submissions/:semester/:examId/:id" element={<SubmissionDetail />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
