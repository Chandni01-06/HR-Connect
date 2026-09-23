import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const EmployeeRow = ({ employee, leaveCount = 0, onEdit, onDelete }) => {
  return (
    <tr 
      style={{ borderColor: '#E5DDE2' }}
      className="hover:bg-[#F8DCE5]/25 transition-colors border-b"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div 
            style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
            className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center mr-3 shrink-0 uppercase shadow-2xs"
          >
            {employee.name ? employee.name[0].toUpperCase() : 'E'}
          </div>
          <div>
            <div className="font-semibold text-[#2D2D35] text-sm">{employee.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6870]">
        {employee.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span 
          style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#2D2D35' }}
          className="px-2.5 py-1 text-xs font-medium rounded-full border"
        >
          {employee.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2D35]">
        <span 
          style={{ borderColor: '#E5DDE2' }}
          className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F5F3F4] text-[#6B6870] border"
        >
          {employee.department}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2D2D35]">
        ₹{employee.salary.toLocaleString('en-IN')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span 
          style={
            leaveCount > 0 
              ? { backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }
              : { backgroundColor: '#F5F3F4', color: '#6B6870', borderColor: '#E5DDE2' }
          }
          className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs"
        >
          {leaveCount} {leaveCount === 1 ? 'Day' : 'Days'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => onEdit(employee)}
          style={{ borderColor: '#E5DDE2', backgroundColor: '#F8DCE5', color: '#D94F7A' }}
          className="inline-flex items-center gap-1 hover:opacity-85 border px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium"
          title="Edit Employee"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(employee._id)}
          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium"
          title="Delete Employee"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;
