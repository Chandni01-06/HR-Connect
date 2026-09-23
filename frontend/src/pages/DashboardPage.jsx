import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardView from '../components/DashboardView';
import EmployeesView from '../components/EmployeesView';
import AttendanceView from '../components/AttendanceView';
import LeavesView from '../components/LeavesView';
import DepartmentsView from '../components/DepartmentsView';
import SettingsView from '../components/SettingsView';

// Modals
import EmployeeModal from '../components/EmployeeModal';
import AttendanceModal from '../components/AttendanceModal';
import LeaveModal from '../components/LeaveModal';
import DepartmentModal from '../components/DepartmentModal';

const API_BASE = 'http://localhost:5000/api';

const DashboardPage = ({ onLogout }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState(localStorage.getItem('username') || 'Admin');

  // Data States
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Loading & Error States
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal Control States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAllData = () => {
    fetchEmployees();
    fetchDepartments();
    fetchAttendance();
    fetchLeaves();
  };

  // Load initial data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // 1. Employee API Calls
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await fetch(`${API_BASE}/employees`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch employees');
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    const url = editingEmployee 
      ? `${API_BASE}/employees/${editingEmployee._id}` 
      : `${API_BASE}/employees`;
    const method = editingEmployee ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save employee');

      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
      fetchDepartments(); // refresh counts
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete employee');

      setEmployees(employees.filter(e => e._id !== id));
      fetchDepartments();
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. Department API Calls
  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const res = await fetch(`${API_BASE}/departments`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch departments');
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleSaveDepartment = async (deptData) => {
    const url = editingDept 
      ? `${API_BASE}/departments/${editingDept._id}` 
      : `${API_BASE}/departments`;
    const method = editingDept ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(deptData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save department');

      setIsDeptModalOpen(false);
      setEditingDept(null);
      fetchDepartments();
      fetchEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`${API_BASE}/departments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete department');

      setDepartments(departments.filter(d => d._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. Attendance API Calls
  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const res = await fetch(`${API_BASE}/attendance`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch attendance');
      setAttendance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleSaveAttendance = async (attendanceData) => {
    const url = editingAttendance 
      ? `${API_BASE}/attendance/${editingAttendance._id}` 
      : `${API_BASE}/attendance`;
    const method = editingAttendance ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save attendance record');

      setIsAttendanceModalOpen(false);
      setEditingAttendance(null);
      fetchAttendance();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      const res = await fetch(`${API_BASE}/attendance/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete attendance record');

      setAttendance(attendance.filter(a => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Leave API Calls
  const fetchLeaves = async () => {
    setLoadingLeaves(true);
    try {
      const res = await fetch(`${API_BASE}/leaves`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch leaves');
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleCreateLeave = async (leaveData) => {
    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit leave request');

      setIsLeaveModalOpen(false);
      fetchLeaves();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update leave request');

      // Update state locally or refetch
      setLeaves(leaves.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLeave = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete leave request');

      setLeaves(leaves.filter(l => l._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3F4] flex text-[#2D2D35]">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        username={adminUsername}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          username={adminUsername}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              attendance={attendance}
              leaves={leaves}
              departments={departments}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onApproveLeave={(id) => handleUpdateLeaveStatus(id, 'Approved')}
              onRejectLeave={(id) => handleUpdateLeaveStatus(id, 'Rejected')}
              onAddEmployee={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              departments={departments}
              leaves={leaves}
              loading={loadingEmployees}
              error={errorMsg}
              onAddClick={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              onEditClick={(emp) => {
                setEditingEmployee(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteClick={handleDeleteEmployee}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              employees={employees}
              loading={loadingAttendance}
              onMarkClick={() => {
                setEditingAttendance(null);
                setIsAttendanceModalOpen(true);
              }}
              onEditClick={(rec) => {
                setEditingAttendance(rec);
                setIsAttendanceModalOpen(true);
              }}
              onDeleteClick={handleDeleteAttendance}
            />
          )}

          {activeTab === 'leaves' && (
            <LeavesView
              leaves={leaves}
              employees={employees}
              loading={loadingLeaves}
              onNewRequestClick={() => setIsLeaveModalOpen(true)}
              onApproveLeave={(id) => handleUpdateLeaveStatus(id, 'Approved')}
              onRejectLeave={(id) => handleUpdateLeaveStatus(id, 'Rejected')}
              onDeleteLeave={handleDeleteLeave}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentsView
              departments={departments}
              employees={employees}
              loading={loadingDepts}
              onAddClick={() => {
                setEditingDept(null);
                setIsDeptModalOpen(true);
              }}
              onEditClick={(dept) => {
                setEditingDept(dept);
                setIsDeptModalOpen(true);
              }}
              onDeleteClick={handleDeleteDepartment}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUsername={adminUsername}
              onProfileUpdated={(newUsername) => setAdminUsername(newUsername)}
            />
          )}
        </main>
      </div>

      {/* Reusable Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleSaveEmployee}
        employee={editingEmployee}
        departments={departments}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSubmit={handleSaveAttendance}
        record={editingAttendance}
        employees={employees}
      />

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleCreateLeave}
        employees={employees}
        leaves={leaves}
      />

      <DepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSubmit={handleSaveDepartment}
        department={editingDept}
      />
    </div>
  );
};

export default DashboardPage;
