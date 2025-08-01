// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ViewClearance } from "../pages/ViewClearance";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/clearing-officer/Dashboard";
import Courses from "../pages/clearing-officer/Courses";
import StudentRecord from "../pages/clearing-officer/StudentRecord";
import Requirements from "../pages/clearing-officer/Requirements";
import Events from "@/pages/clearing-officer/Events";
import AccountSettings from "@/pages/clearing-officer/AccountSettings";
import AdminDashboard from "@/pages/admin-side/Dashboard";
import AdminLayout from "@/layouts/AdminLayout";
import AddStudents from "@/pages/admin-side/AddStudents";
import AddClearingOfficer from "@/pages/admin-side/AddClearingOfficer";
import AdminSettings from "@/pages/admin-side/AccountSettings";
import Layout from "@/layouts/Layout";
import Home from "@/pages/Home";
import SidebarLayout from "@/layouts/SidebarLayout";
import ViewQrCodePermit from "@/pages/ViewQrCodePermit";
import ProtectedRoute from "@/components/ProtectedRoute";
import Register from "@/pages/auth/Register";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/**Route for Home*/}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Unauthorized />} />
      </Route>

      {/**Route for admin */}
      <Route
        path="/admin-side"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="addStudents" element={<AddStudents />} />
        <Route path="addClearingOfficer" element={<AddClearingOfficer />} />
        <Route path="adminSettings" element={<AdminSettings />} />
        <Route path="*" element={<Unauthorized />} />
      </Route>
      {/**Route for clearing officer */}
      <Route
        path="/clearing-officer"
        element={
          <ProtectedRoute allowedRoles={["clearingOfficer"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="student-records" element={<StudentRecord />} />
        <Route path="requirements" element={<Requirements />} />
        <Route path="events" element={<Events />} />
        <Route path="accountSettings" element={<AccountSettings />} />
        <Route path="*" element={<Unauthorized />} />
      </Route>
      {/**General Route */}
      <Route path="permit" element={<ViewQrCodePermit />} />
      <Route path="login" element={<Login />} />
      <Route path="clearance" element={<ViewClearance />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
