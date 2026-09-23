import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee, departments = [] }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');

  // Default department options if none fetched from DB yet
  const defaultDepartments = [
    'Engineering',
    'Human Resources',
    'Marketing',
    'Finance',
    'Sales',
    'Design'
  ];

  const departmentList = departments.length > 0
    ? departments.map(d => typeof d === 'string' ? d : d.name)
    : defaultDepartments;

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone || '');
      setRole(employee.role);
      setDepartment(employee.department);
      setSalary(employee.salary.toString());
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('');
      setDepartment('');
      setSalary('');
    }
    setError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !role || !department || !salary) {
      if (!/^[0-9+ -]{10,15}$/.test(phone.trim()))
        setError('Please fill in all fields.');
      return;
    }

    if (isNaN(salary) || Number(salary) <= 0) {
      setError('Salary must be a valid positive number.');
      return;
    }

    const employeeData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role.trim(),
      department,
      salary: Number(salary)
    };

    onSubmit(employeeData);
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
              {employee ? 'Edit Employee Details' : 'Add New Employee'}
            </h3>
            <p className="text-xs text-[#6B6870]">Enter employee profile information</p>
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
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Patel"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rajesh@company.com"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Job Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Engineer"
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
              >
                <option value="">Select Dept...</option>
                {departmentList.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Salary (Annual in ₹)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 75000"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            />
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
              {employee ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
