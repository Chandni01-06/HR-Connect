import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AttendanceModal = ({ isOpen, onClose, onSubmit, record, employees = [] }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [employeeName, setEmployeeName] = useState('');
  const [date, setDate] = useState(todayStr);
  const [status, setStatus] = useState('Present');
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      setEmployeeName(record.employeeName || '');
      setDate(record.date || todayStr);
      setStatus(record.status || 'Present');
    } else {
      setEmployeeName(employees.length > 0 ? employees[0].name : '');
      setDate(todayStr);
      setStatus('Present');
    }
    setError('');
  }, [record, isOpen, employees, todayStr]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!employeeName || !date || !status) {
      setError('Please fill in all fields.');
      return;
    }

    const matched = employees.find(e => e.name === employeeName);

    onSubmit({
      employeeName: employeeName.trim(),
      employeeId: matched ? matched._id : undefined,
      date,
      status
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
              {record ? 'Edit Attendance Record' : 'Mark Daily Attendance'}
            </h3>
            <p className="text-xs text-[#6B6870]">Record employee presence for the workday</p>
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
                    {emp.name} ({emp.department} - {emp.role})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g. Rajesh Patel"
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Attendance Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm font-medium"
            >
              <option value="Present">Present (Office)</option>
              <option value="Work From Home">Work From Home (WFH)</option>
              <option value="Absent">Absent</option>
            </select>
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
              {record ? 'Update Attendance' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
