import React from 'react';
import StatCard from './StatCard';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  Check, 
  X, 
  ArrowRight,
  Building2,
  CalendarCheck
} from 'lucide-react';

const DashboardView = ({ 
  employees, 
  attendance, 
  leaves, 
  departments, 
  onNavigateTab, 
  onApproveLeave, 
  onRejectLeave,
  onAddEmployee 
}) => {
  // 1. Existing calculations
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

  // 2. New calculations: Present Today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(rec => rec.date === todayStr);
  const presentToday = todayAttendance.filter(rec => rec.status === 'Present').length;
  const wfhToday = todayAttendance.filter(rec => rec.status === 'Work From Home').length;
  const absentToday = todayAttendance.filter(rec => rec.status === 'Absent').length;

  // 3. New calculations: Pending Leave Requests
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-6 rounded-xl border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#2D2D35] tracking-tight">Welcome back, Admin! 👋</h1>
          <p className="text-sm text-[#6B6870] mt-0.5">
            Here is what's happening with your team and organization today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onAddEmployee}
            style={{ backgroundColor: '#D94F7A' }}
            className="w-full sm:w-auto px-4 py-2 hover:opacity-90 text-white text-sm font-semibold rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Registered staff"
          icon={<Users className="w-6 h-6" />}
          iconBg="#F8DCE5"
          iconColor="#D94F7A"
        />
        <StatCard
          title="Total Payroll"
          value={`₹${totalPayroll.toLocaleString('en-IN')}`}
          subtitle="Monthly commitment"
          icon={<IndianRupee className="w-6 h-6" />}
          iconBg="#F8DCE5"
          iconColor="#D94F7A"
        />
        <StatCard
          title="Average Salary"
          value={`₹${avgSalary.toLocaleString('en-IN')}`}
          subtitle="Per employee"
          icon={<TrendingUp className="w-6 h-6" />}
          iconBg="#F8DCE5"
          iconColor="#D94F7A"
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle={`${wfhToday} WFH | ${absentToday} Absent`}
          icon={<UserCheck className="w-6 h-6" />}
          iconBg="#F8DCE5"
          iconColor="#D94F7A"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          subtitle="Awaiting action"
          icon={<Clock className="w-6 h-6" />}
          iconBg="#F8DCE5"
          iconColor="#D94F7A"
        />
      </div>

      {/* Middle Grid: Pending Leaves Quick Action & Today's Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Pending Leave Requests */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="lg:col-span-2 bg-white rounded-xl border shadow-xs p-5"
        >
          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="flex items-center justify-between pb-4 border-b"
          >
            <div>
              <h3 className="font-bold text-[#2D2D35] text-base">Pending Leave Requests</h3>
              <p className="text-xs text-[#6B6870]">Quickly review and approve/reject staff requests</p>
            </div>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs font-semibold text-[#D94F7A] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="mt-4 divide-y divide-slate-100"
          >
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Check className="w-8 h-8 mx-auto text-[#D94F7A] mb-2 bg-[#F8DCE5] p-1.5 rounded-full" />
                <p className="text-sm font-medium text-[#2D2D35]">All caught up!</p>
                <p className="text-xs text-[#6B6870]">There are no pending leave requests right now.</p>
              </div>
            ) : (
              pendingLeaves.slice(0, 4).map((leave) => (
                <div key={leave._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#2D2D35]">{leave.employeeName}</span>
                      <span 
                        style={{ backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                      >
                        {leave.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6870]">
                      <span className="font-medium text-[#2D2D35]">Dates:</span> {leave.startDate} to {leave.endDate} • <span className="italic">"{leave.reason}"</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveLeave(leave._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                      title="Approve Leave"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onRejectLeave(leave._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                      title="Reject Leave"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Today's Attendance Breakdown */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="bg-white rounded-xl border shadow-xs p-5 flex flex-col justify-between"
        >
          <div>
            <div 
              style={{ borderColor: '#E5DDE2' }}
              className="flex items-center justify-between pb-3 border-b"
            >
              <h3 className="font-bold text-[#2D2D35] text-base">Today's Attendance</h3>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs font-semibold text-[#D94F7A] hover:underline inline-flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#6B6870] mt-2">
              Date: <span className="font-medium text-[#2D2D35]">{todayStr}</span>
            </p>

            <div className="mt-4 space-y-3">
              <div 
                style={{ borderColor: '#E5DDE2' }}
                className="p-3 bg-emerald-50/70 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-emerald-950">Present</span>
                </div>
                <span className="text-lg font-bold text-emerald-700">{presentToday}</span>
              </div>

              <div 
                style={{ borderColor: '#E5DDE2' }}
                className="p-3 bg-[#F8DCE5]/40 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div style={{ backgroundColor: '#D94F7A' }} className="w-3 h-3 rounded-full"></div>
                  <span className="text-sm font-medium text-[#2D2D35]">Work From Home</span>
                </div>
                <span style={{ color: '#D94F7A' }} className="text-lg font-bold">{wfhToday}</span>
              </div>

              <div 
                style={{ borderColor: '#E5DDE2' }}
                className="p-3 bg-red-50/70 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-950">Absent</span>
                </div>
                <span className="text-lg font-bold text-red-700">{absentToday}</span>
              </div>
            </div>
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="mt-5 pt-4 border-t"
          >
            <button
              onClick={() => onNavigateTab('attendance')}
              style={{ borderColor: '#E5DDE2' }}
              className="w-full py-2 bg-[#F5F3F4] hover:bg-[#F8DCE5]/40 border text-[#2D2D35] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#D94F7A]" />
              <span>Mark Today's Attendance</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row: Departments Overview */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white rounded-xl border shadow-xs p-5"
      >
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="flex items-center justify-between pb-3 border-b"
        >
          <div>
            <h3 className="font-bold text-[#2D2D35] text-base">Department Distribution</h3>
            <p className="text-xs text-[#6B6870]">Overview of team distribution across organizational departments</p>
          </div>
          <button
            onClick={() => onNavigateTab('departments')}
            className="text-xs font-semibold text-[#D94F7A] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const count = employees.filter(e => e.department === dept.name).length;
            return (
              <div 
                key={dept._id || dept.name} 
                style={{ borderColor: '#E5DDE2' }}
                className="p-4 rounded-xl border bg-white hover:bg-[#F8DCE5]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div 
                    style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span 
                    style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  >
                    {count} staff
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-[#2D2D35] mt-2.5">{dept.name}</h4>
                <p className="text-xs text-[#6B6870] line-clamp-1 mt-0.5">{dept.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
