import React, { useState } from 'react';
import { CalendarOff, Plus, Search, Check, X, Trash2, Calendar } from 'lucide-react';

const LeavesView = ({ 
  leaves = [], 
  loading, 
  error, 
  onNewRequestClick, 
  onApproveLeave, 
  onRejectLeave, 
  onDeleteLeave 
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [search, setSearch] = useState('');

  // Calculate inclusive days between start date and end date
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

  const getLeaveDays = (leave) => {
    return calculateDays(leave.startDate, leave.endDate);
  };

  // Calculate total approved leaves taken per person
  const employeeLeaveCountMap = {};
  leaves.forEach((l) => {
    if (l.employeeName) {
      if (!employeeLeaveCountMap[l.employeeName]) {
        employeeLeaveCountMap[l.employeeName] = 0;
      }
      if (l.status === 'Approved') {
        employeeLeaveCountMap[l.employeeName] += getLeaveDays(l);
      }
    }
  });

  // Filter leaves
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = activeStatusTab === 'All' || leave.status === activeStatusTab;
    const matchesSearch = 
      (leave.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (leave.leaveType || '').toLowerCase().includes(search.toLowerCase()) ||
      (leave.reason || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate counts for tabs
  const countAll = leaves.length;
  const countPending = leaves.filter(l => l.status === 'Pending').length;
  const countApproved = leaves.filter(l => l.status === 'Approved').length;
  const countRejected = leaves.filter(l => l.status === 'Rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-200 bg-amber-50 text-amber-700">
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-red-200 bg-red-50 text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-[#2D2D35]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-5 rounded-xl border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2D2D35]">Leave Management</h2>
          <p className="text-xs text-[#6B6870] mt-0.5">
            Review, approve, reject and manage employee leave applications
          </p>
        </div>

        <button
          onClick={onNewRequestClick}
          style={{ backgroundColor: '#D94F7A' }}
          className="w-full sm:w-auto px-4 py-2 hover:opacity-90 text-white text-sm font-semibold rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Leave Request</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-4 rounded-xl border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between"
      >
        {/* Status Filter Tabs */}
        <div 
          style={{ borderColor: '#E5DDE2', backgroundColor: '#F5F3F4' }}
          className="flex items-center gap-1.5 p-1 border rounded-lg w-full md:w-auto overflow-x-auto"
        >
          {[
            { id: 'All', label: 'All', count: countAll },
            { id: 'Pending', label: 'Pending', count: countPending },
            { id: 'Approved', label: 'Approved', count: countApproved },
            { id: 'Rejected', label: 'Rejected', count: countRejected },
          ].map((tab) => {
            const isActive = activeStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                style={isActive ? { borderColor: '#E5DDE2' } : {}}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#D94F7A] shadow-xs border font-bold'
                    : 'text-[#6B6870] hover:text-[#2D2D35]'
                }`}
              >
                <span>{tab.label}</span>
                <span 
                  style={isActive ? { backgroundColor: '#F8DCE5', color: '#D94F7A' } : {}}
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? '' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6B6870] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employee or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F3F4] border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all placeholder-[#6B6870]"
          />
        </div>
      </div>

      {/* Leaves Table */}
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
            <span className="text-sm font-medium text-[#2D2D35]">Loading leave requests...</span>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <div 
              style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            >
              <CalendarOff className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2D35] text-base">No Leave Requests Found</p>
              <p className="text-xs text-[#6B6870] mt-1 max-w-sm mx-auto">
                No leave requests found matching the current filter.
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
                  <th className="px-6 py-3.5">Leave Type</th>
                  <th className="px-6 py-3.5">Leave Dates</th>
                  <th className="px-6 py-3.5 text-center">Leave Count</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody 
                style={{ borderColor: '#E5DDE2' }}
                className="divide-y divide-slate-100 text-sm"
              >
                {filteredLeaves.map((leave) => {
                  const days = getLeaveDays(leave);
                  const totalTaken = employeeLeaveCountMap[leave.employeeName] || 0;

                  return (
                    <tr key={leave._id} className="hover:bg-[#F8DCE5]/25 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                            className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mr-3 shrink-0 uppercase shadow-2xs"
                          >
                            {leave.employeeName ? leave.employeeName[0] : 'L'}
                          </div>
                          <div>
                            <span className="font-semibold text-[#2D2D35] text-sm block">{leave.employeeName}</span>
                            <span className="text-[11px] text-[#6B6870]">
                              Total taken: <strong className="text-[#D94F7A]">{totalTaken} {totalTaken === 1 ? 'day' : 'days'}</strong>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2D35]">
                        <span 
                          style={{ borderColor: '#E5DDE2' }}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F5F3F4] text-[#2D2D35] border"
                        >
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-[#2D2D35] font-medium">
                        {leave.startDate} <span className="text-[#6B6870]">to</span> {leave.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span 
                          style={{ backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{days} {days === 1 ? 'Day' : 'Days'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6B6870] max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1.5">
                        {leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => onApproveLeave(leave._id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium transition-colors"
                              title="Approve Leave"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onRejectLeave(leave._id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium transition-colors"
                              title="Reject Leave"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDeleteLeave(leave._id)}
                          className="inline-flex items-center text-[#6B6870] hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesView;
