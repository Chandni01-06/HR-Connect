import React, { useState } from 'react';
import { Building2, Plus, Users, Pencil, Trash2, Search } from 'lucide-react';

const DepartmentsView = ({ 
  departments, 
  employees, 
  loading, 
  error, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) => {
  const [search, setSearch] = useState('');

  const filteredDepts = departments.filter((dept) => 
    (dept.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (dept.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-5 rounded-xl border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2D2D35]">Department Management</h2>
          <p className="text-xs text-[#6B6870] mt-0.5">
            Organize business functions and track staff allocations by department
          </p>
        </div>

        <button
          onClick={onAddClick}
          style={{ backgroundColor: '#D94F7A' }}
          className="w-full sm:w-auto px-4 py-2 hover:opacity-90 text-white text-sm font-semibold rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-4 rounded-xl border shadow-xs flex items-center justify-between"
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B6870] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#E5DDE2' }}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F3F4] border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all placeholder-[#6B6870]"
          />
        </div>
      </div>

      {/* Departments Grid */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="bg-white rounded-xl border p-16 flex flex-col items-center justify-center space-y-3"
        >
          <div 
            style={{ borderColor: '#D94F7A', borderTopColor: 'transparent' }}
            className="w-8 h-8 border-3 rounded-full animate-spin"
          ></div>
          <span className="text-sm font-medium text-[#2D2D35]">Loading departments...</span>
        </div>
      ) : filteredDepts.length === 0 ? (
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="bg-white rounded-xl border p-16 text-center space-y-3"
        >
          <div 
            style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          >
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-[#2D2D35] text-base">No Departments Found</p>
            <p className="text-xs text-[#6B6870] mt-1 max-w-sm mx-auto">
              {search 
                ? 'No departments match your search term.' 
                : 'Click "Add Department" to create your first team division.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepts.map((dept) => {
            const count = dept.employeeCount !== undefined 
              ? dept.employeeCount 
              : employees.filter(e => e.department === dept.name).length;

            return (
              <div 
                key={dept._id} 
                style={{ borderColor: '#E5DDE2' }}
                className="bg-white rounded-xl border shadow-xs hover:shadow-sm hover:border-[#D94F7A]/50 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div 
                      style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    
                    <span 
                      style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{count} {count === 1 ? 'employee' : 'employees'}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-[#2D2D35] text-base mb-1.5">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-[#6B6870] leading-relaxed min-h-[36px]">
                    {dept.description}
                  </p>
                </div>

                <div 
                  style={{ borderColor: '#E5DDE2' }}
                  className="pt-4 mt-4 border-t flex items-center justify-end gap-2"
                >
                  <button
                    onClick={() => onEditClick(dept)}
                    style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#D94F7A' }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-lg transition-opacity hover:opacity-85"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteClick(dept._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DepartmentsView;
