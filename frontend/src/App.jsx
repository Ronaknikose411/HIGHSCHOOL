import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./auth/components/Login";
import StudentDashboard from "./roles/student/StudentDashboard";
import ResultPage from "./roles/student/ResultPage";
import ManageStudentStudent from "./roles/student/ManageStudent";
import TeacherDashboard from "./roles/teacher/TeacherDashboard";
import ManageMarks from "./roles/teacher/ManageMarks";
import AdminDashboard from "./roles/admin/AdminDashboard";
import SuperAdminDashboard from "./roles/superadmin/SuperAdminDashboard";
import ProtectedRoute from "./auth/routes/ProtectedRoute";
import PublicRoute from "./auth/routes/PublicRoute";
import NotFound from "./pages/NotFound";
import AuthProvider from "./auth/context/AuthProvider";
import AllStudents from "./components/AllStudents";
import SubjectMarks from "./components/SubjectMarks";
import AllSubjects from "./components/AllSubjects";
import StudentDetails from "./components/StudentDetails";
import AllStudentMarks from "./components/AllStudentMarks";
import AddStudent from "./components/AddStudent";
import ViewAllAdminsAndTeachers from "./roles/superadmin/ViewAllAdminsAndTeachers";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route
            path="/student/dashboard"
            element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/student/result/:studentId"
            element={<ProtectedRoute allowedRoles={["student", "teacher", "admin", "superadmin"]}><ResultPage /></ProtectedRoute>}
          />
          <Route
            path="/student/manage"
            element={<ProtectedRoute allowedRoles={["student"]}><ManageStudentStudent /></ProtectedRoute>}
          />
          <Route
            path="/teacher/dashboard"
            element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>}
          />
          <Route
            path="/teacher/managemarks"
            element={<ProtectedRoute allowedRoles={["teacher"]}><ManageMarks /></ProtectedRoute>}
          />
          <Route
            path="/teacher/subjectmarks/:subjectID"
            element={<ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}><SubjectMarks /></ProtectedRoute>}
          />
          <Route
            path="/teacher/allstudents"
            element={<ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}><AllStudents /></ProtectedRoute>}
          />
          <Route
            path="/teacher/allstudentsmarks"
            element={<ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}><AllStudentMarks /></ProtectedRoute>}
          />
          <Route
            path="/teacher/allsubjects"
            element={<ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}><AllSubjects /></ProtectedRoute>}
          />
          <Route
            path="/teacher/studentdetails/:studentId"
            element={<ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}><StudentDetails /></ProtectedRoute>}
          />
          <Route
            path="/teacher/manage-students"
            element={<ProtectedRoute allowedRoles={["teacher"]}><AddStudent /></ProtectedRoute>}
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
          />
         
          <Route
            path="/superadmin/dashboard"
            element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminDashboard /></ProtectedRoute>}
          />
          
          <Route
            path="/superadmin/viewall"
            element={<ProtectedRoute allowedRoles={["superadmin","admin"]}><ViewAllAdminsAndTeachers /></ProtectedRoute>}
          />
         
         
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;