import React, { useState } from 'react';
import EmployeeRow from './EmployeeRow';
import { Search, Plus, Users } from 'lucide-react';

const EmployeesView = ({ 
  employees, 
  departments = [], 
  leaves = [],
  loading, 
  error, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');

  // Robust inclusive days calculation
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const [y1, m1, d1] = start.split('-').map(Number);
    const [y2, m2, d2] = end.split('-').map(Number);
    if (!y1 || !y2) return 1;
    const date1 = new Date(Date.UTC(y1, m1 - 1, d1));
    const date2 = new Date(Date.UTC(y2, m2 - 1, d2));
    const diffTime = date2.getTime() - date1.getTime();
    if (isNaN(diffTime) || diffTime < 0) return 1;
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getEmployeeLeaveCount = (empName) => {
    return leaves
      .filter(l => l.employeeName === empName && l.status === 'Approved')
      .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
  };

  // Filter employees list by search term and selected department
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      (emp.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (emp.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === '' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departmentList = departments.length > 0
    ? departments.map(d => typeof d === 'string' ? d : d.name)
    : ['Engineering', 'Human Resources', 'Marketing', 'Finance', 'Sales', 'Design'];

  return (
    <div className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-5 rounded-xl border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2D2D35]">All Employees</h2>
          <p className="text-xs text-[#6B6870] mt-0.5">
            Showing <span className="font-semibold text-[#2D2D35]">{filteredEmployees.length}</span> of {employees.length} total staff members
          </p>
        </div>

        <button
          onClick={onAddClick}
          style={{ backgroundColor: '#D94F7A' }}
          className="w-full sm:w-auto px-4 py-2.5 hover:opacity-90 text-white text-sm font-semibold rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Department Filter Toolbar */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-4 rounded-xl border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between"
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B6870] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F3F4] border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all placeholder-[#6B6870]"
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <span className="text-xs font-medium text-[#6B6870] whitespace-nowrap hidden sm:inline">
            Filter:
          </span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="w-full md:w-auto bg-[#F5F3F4] border rounded-lg px-3 py-2 text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all"
          >
            <option value="">All Departments</option>
            {departmentList.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table Container */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white rounded-xl border shadow-xs overflow-hidden"
      >
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <div 
              style={{ borderColor: '#D94F7A', borderTopColor: 'transparent' }}
              className="w-8 h-8 border-3 rounded-full animate-spin"
            ></div>
            <span className="text-sm font-medium text-[#2D2D35]">Loading employee directory...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <div 
              style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2D35] text-base">No Employees Found</p>
              <p className="text-xs text-[#6B6870] mt-1 max-w-sm mx-auto">
                {search || filterDept 
                  ? 'No employees match your search criteria. Try clearing filters.'
                  : 'Start by clicking "Add Employee" to register team members.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead 
                style={{ borderColor: '#E5DDE2' }}
                className="bg-[#F5F3F4] border-b text-xs font-semibold text-[#6B6870] uppercase tracking-wider"
              >
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Salary</th>
                  <th className="px-6 py-3.5 text-center">Leave Count</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody 
                style={{ borderColor: '#E5DDE2' }}
                className="divide-y divide-slate-100 text-sm"
              >
                {filteredEmployees.map((emp) => (
                  <EmployeeRow
                    key={emp._id}
                    employee={emp}
                    leaveCount={getEmployeeLeaveCount(emp.name)}
                    onEdit={onEditClick}
                    onDelete={onDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesView;
