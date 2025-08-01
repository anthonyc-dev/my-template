import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin-side/AdminNavbar";
import { AdminSideMenu } from "@/components/admin-side/AdminSidebarMenu";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
      >
        <AdminSideMenu closeSidebar={toggleSidebar} />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
