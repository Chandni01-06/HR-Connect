import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DepartmentModal = ({ isOpen, onClose, onSubmit, department }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (department) {
      setName(department.name || '');
      setDescription(department.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [department, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Both department name and description are required.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim()
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
              {department ? 'Edit Department' : 'Add New Department'}
            </h3>
            <p className="text-xs text-[#6B6870]">Define department details and functional responsibilities</p>
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
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Operations / Product"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm placeholder-[#6B6870]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of department scope and activities..."
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
              {department ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
