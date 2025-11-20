import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";

import ProtectedRoute from "./router/ProtectedRoute";
import RoleBasedRoute from "./router/RoleBasedRoute";
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
import CreateExamPage from "./features/admin/pages/CreateExamPage";
import AdminLayout from "./components/Layout/Admin/AdminLayout";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ExaminerLayout from "./components/Layout/Examiner/ExaminerLayout";
import ExaminerDashboard from "./features/examiner/pages/ExaminerDashboard";
import ExaminerSubmissions from "./features/examiner/pages/ExaminerSubmissions";
import ExaminerGrading from "./features/examiner/pages/ExaminerGrading";
import ExtractedSubmissions from "./features/manager/pages/ExtractedSubmissions";
import GradedSubmissionsManagement from "./features/manager/pages/GradedSubmissionsManagement";
import UploadSubmissions from "./features/admin/pages/UploadSubmissions";
import StudentManagement from "./features/admin/pages/StudentManagement";
import AdminSubmissionManagement from "./features/admin/pages/AdminSubmissionManagement";
import AssignByClass from "./features/manager/pages/AssignByClass";

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
              <ExaminerLayout />
            </RoleBasedRoute>
          }
        >
          <Route path="dashboard" element={<ExaminerDashboard />} />
          <Route path="submissions" element={<ExaminerSubmissions />} />
          <Route path="grading/:submissionId" element={<ExaminerGrading />} />
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
          <Route index element={<ExtractedSubmissions />} />
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
          <Route path="extracted" element={<ExtractedSubmissions />} />
          <Route path="graded-submissions" element={<GradedSubmissionsManagement />} />
          <Route path="assign-by-class" element={<AssignByClass />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="exams/create" element={<CreateExamPage />} />
          <Route path="upload-submissions" element={<UploadSubmissions />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="submissions" element={<AdminSubmissionManagement />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
