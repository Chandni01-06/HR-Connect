import React, { useState } from 'react';
import { CalendarCheck, Plus, Search, Calendar, Pencil, Trash2 } from 'lucide-react';

const AttendanceView = ({ 
  attendance, 
  loading, 
  error, 
  onMarkClick, 
  onEditClick, 
  onDeleteClick 
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter attendance records
  const filteredRecords = attendance.filter((record) => {
    const matchesDate = !selectedDate || record.date === selectedDate;
    const matchesSearch = (record.employeeName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Calculate counts for currently displayed/selected date
  const dateSpecificRecords = attendance.filter(r => !selectedDate || r.date === selectedDate);
  const presentCount = dateSpecificRecords.filter(r => r.status === 'Present').length;
  const wfhCount = dateSpecificRecords.filter(r => r.status === 'Work From Home').length;
  const absentCount = dateSpecificRecords.filter(r => r.status === 'Absent').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Present
          </span>
        );
      case 'Work From Home':
        return (
          <span 
            style={{ backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }}
            className="px-2.5 py-1 text-xs font-semibold rounded-full border"
          >
            Work From Home
          </span>
        );
      case 'Absent':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
            Absent
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
      {/* Top Header Card with Summary Metrics */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-5 rounded-xl border shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2D2D35]">Daily Attendance</h2>
          <p className="text-xs text-[#6B6870] mt-0.5">
            Monitor and record employee presence, work from home, and absences
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{presentCount} Present</span>
          </div>
          <div 
            style={{ backgroundColor: '#F8DCE5', borderColor: '#E5DDE2', color: '#D94F7A' }}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5"
          >
            <span style={{ backgroundColor: '#D94F7A' }} className="w-2 h-2 rounded-full"></span>
            <span>{wfhCount} WFH</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{absentCount} Absent</span>
          </div>

          <button
            onClick={onMarkClick}
            style={{ backgroundColor: '#D94F7A' }}
            className="px-4 py-2 hover:opacity-90 text-white text-sm font-semibold rounded-lg shadow-sm transition-opacity flex items-center gap-1.5 ml-auto sm:ml-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-4 rounded-xl border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between"
      >
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6B6870] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F3F4] border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all placeholder-[#6B6870]"
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5">
          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="flex items-center gap-1.5 bg-[#F5F3F4] border rounded-lg px-2.5 py-1"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D94F7A]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-[#2D2D35] focus:outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[#6B6870] hover:text-[#2D2D35] text-xs px-1"
                title="View all dates"
              >
                Clear
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="bg-[#F5F3F4] border rounded-lg px-3 py-2 text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Work From Home">Work From Home</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Attendance Records Table */}
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
            <span className="text-sm font-medium text-[#2D2D35]">Loading attendance records...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <div 
              style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            >
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2D35] text-base">No Attendance Records Found</p>
              <p className="text-xs text-[#6B6870] mt-1 max-w-sm mx-auto">
                No logs recorded for this date or search criteria. Click "Mark Attendance" to record today's presence.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead 
                style={{ borderColor: '#E5DDE2' }}
                className="bg-[#F5F3F4] border-b text-xs font-semibold text-[#6B6870] uppercase tracking-wider"
              >
                <tr>
                  <th className="px-6 py-3.5">Employee Name</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Attendance Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody 
                style={{ borderColor: '#E5DDE2' }}
                className="divide-y divide-slate-100 text-sm"
              >
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-[#F8DCE5]/25 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                          className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mr-3 shrink-0 uppercase shadow-2xs"
                        >
                          {record.employeeName ? record.employeeName[0] : 'E'}
                        </div>
                        <span className="font-semibold text-[#2D2D35] text-sm">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2D35] font-medium">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEditClick(record)}
                        style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                        className="inline-flex items-center gap-1 hover:opacity-85 border px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium"
                        title="Edit Attendance"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteClick(record._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;
