import React from 'react';
import { Menu, Calendar } from 'lucide-react';

const Header = ({ activeTab, onToggleSidebar, username }) => {
  const getTabDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Real-time organization metrics & activity' };
      case 'employees':
        return { title: 'Employee Management', subtitle: 'Manage employee profiles, roles, and salaries' };
      case 'attendance':
        return { title: 'Attendance Management', subtitle: 'Daily attendance logs and presence records' };
      case 'leaves':
        return { title: 'Leave Management', subtitle: 'Review, approve, and track employee leave requests' };
      case 'departments':
        return { title: 'Department Management', subtitle: 'Manage company departments and team distributions' };
      case 'settings':
        return { title: 'Admin Settings', subtitle: 'Update your administrator credentials and profile' };
      default:
        return { title: 'HR System', subtitle: 'Management Portal' };
    }
  };

  const { title, subtitle } = getTabDetails();

  // Format today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header 
      style={{ borderColor: '#E5DDE2' }}
      className="h-16 bg-white border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#6B6870] hover:bg-[#F5F3F4] hover:text-[#2D2D35] transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#2D2D35] tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs text-[#6B6870] hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date badge */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F5F3F4] border rounded-lg text-xs font-medium text-[#6B6870]"
        >
          <Calendar className="w-3.5 h-3.5 text-[#D94F7A]" />
          <span>{today}</span>
        </div>

        {/* Admin Pill */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="flex items-center gap-2 px-2.5 py-1 bg-[#F5F3F4] border rounded-full"
        >
          <div 
            style={{ backgroundColor: '#D94F7A' }}
            className="w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center uppercase shadow-2xs"
          >
            {username ? username[0] : 'A'}
          </div>
          <span className="text-xs font-semibold text-[#2D2D35] pr-1">{username || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
