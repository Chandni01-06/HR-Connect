import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, UserCheck } from 'lucide-react';

const LeaveModal = ({ isOpen, onClose, onSubmit, employees = [], leaves = [] }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [employeeName, setEmployeeName] = useState('');
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Helper to calculate inclusive days
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const [y1, m1, d1] = start.split('-').map(Number);
    const [y2, m2, d2] = end.split('-').map(Number);
    if (!y1 || !y2) return 1;
    const date1 = new Date(Date.UTC(y1, m1 - 1, d1));
    const date2 = new Date(Date.UTC(y2, m2 - 1, d2));
    const diffTime = date2.getTime() - date1.getTime();
    if (isNaN(diffTime) || diffTime < 0) return 0;
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDays = calculateDays(startDate, endDate);

  // Calculate selected employee's existing holiday count
  const selectedEmpLeaves = leaves.filter(l => l.employeeName === employeeName);
  const selectedEmpApprovedDays = selectedEmpLeaves
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
  const selectedEmpPendingDays = selectedEmpLeaves
    .filter(l => l.status === 'Pending')
    .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);

  useEffect(() => {
    if (isOpen) {
      setEmployeeName(employees.length > 0 ? employees[0].name : '');
      setLeaveType('Sick Leave');
      setStartDate(todayStr);
      setEndDate(todayStr);
      setReason('');
      setError('');
    }
  }, [isOpen, employees, todayStr]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!employeeName || !leaveType || !startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    const matched = employees.find(e => e.name === employeeName);

    onSubmit({
      employeeName: employeeName.trim(),
      employeeId: matched ? matched._id : undefined,
      leaveType,
      startDate,
      endDate,
      days: calculatedDays,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border overflow-hidden transform transition-all animate-in fade-in zoom-in duration-150"
      >
        {/* Modal Header */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="px-6 py-4 bg-[#F5F3F4] border-b flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-[#2D2D35]">
              Submit Leave Request
            </h3>
            <p className="text-xs text-[#6B6870]">Record a new leave request and calculate holiday count</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Employee Name
            </label>
            {employees.length > 0 ? (
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              >
                <option value="">Select Employee...</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.name}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g. Sunita Sharma"
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              />
            )}

            {employeeName && (
              <div 
                style={{ borderColor: '#E5DDE2', backgroundColor: '#F5F3F4' }}
                className="mt-2 px-3 py-1.5 rounded-lg border flex items-center justify-between text-xs text-[#6B6870]"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D94F7A]" />
                  <span>Approved holidays taken:</span>
                  <strong className="text-[#D94F7A]">{selectedEmpApprovedDays} {selectedEmpApprovedDays === 1 ? 'day' : 'days'}</strong>
                </span>
                {selectedEmpPendingDays > 0 && (
                  <span className="text-amber-700 font-medium">({selectedEmpPendingDays}d pending)</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Paid Leave">Paid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              />
            </div>
          </div>

          {/* Dynamic Day Count Box */}
          <div 
            style={{ 
              borderColor: '#E5DDE2',
              backgroundColor: '#F8DCE5'
            }}
            className="p-3 rounded-lg border flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2D35]">
              <Calendar className="w-4 h-4 text-[#D94F7A]" />
              <span>Leave Duration (Holiday Count):</span>
            </div>
            <span 
              style={{ backgroundColor: '#D94F7A' }}
              className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
            >
              {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Medical checkup / Family function"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            ></textarea>
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="pt-4 border-t flex justify-end gap-3"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#D94F7A' }}
              className="px-4 py-2 hover:opacity-90 text-white rounded-lg transition-opacity shadow-sm text-sm font-semibold active:scale-98"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
