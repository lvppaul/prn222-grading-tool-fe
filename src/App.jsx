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
import ManagerLayout from "./components/Layout/Manager/ManagerLayout";
import ManagerSemesterDashboard from "./features/manager/pages/ManagerSemesterDashboard";
import ManagerExamDashboard from "./features/manager/pages/ManagerExamDashboard";
import ManagerSubmissions from "./features/manager/pages/ManagerSubmissions";
import ManagerSubmissionsDetail from "./features/manager/pages/SubmissionDetail";

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
            <RoleBasedRoute allowedRoles={["Examiner"]}>
              <Layout>
                <ExaminerDashboard />
              </Layout>
            </RoleBasedRoute>
          }
        />

        {/* Examiner - Grading */}
        <Route
          path="/examiner/grading"
          element={
            // <RoleBasedRoute allowedRoles={["Examiner"]}>
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
            <RoleBasedRoute allowedRoles={["Examiner"]}>
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
            <RoleBasedRoute allowedRoles={["Moderator"]}>
              <ModeratorLayout />
            </RoleBasedRoute>
          }
        >
          <Route path="semesters" element={<SemesterDashboard />} />
          <Route path="exams/:semester" element={<ExamDashboard />} />
          <Route
            path="submissions/:semester/:examId"
            element={<ModeratorSubmissions />}
          />
          <Route
            path="submissions/:semester/:examId/:id"
            element={<SubmissionDetail />}
          />
        </Route>

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <RoleBasedRoute allowedRoles={["Manager"]}>
              <ManagerLayout />
            </RoleBasedRoute>
          }
        >
          <Route path="semesters" element={<ManagerSemesterDashboard />} />
          <Route path="exams/:semester" element={<ManagerExamDashboard />} />
          <Route
            path="submissions/:semester/:examId"
            element={<ManagerSubmissions />}
          />
          <Route
            path="submissions/:semester/:examId/:id"
            element={<ManagerSubmissionsDetail />}
          />
        </Route>

        {/* Default */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
