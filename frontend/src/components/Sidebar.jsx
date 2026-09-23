import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarOff, 
  Building2, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, onLogout, username, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'leaves', label: 'Leave Management', icon: CalendarOff },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{ backgroundColor: '#3B1E3A' }}
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl border-r border-[#45203F]`}
      >
        {/* Brand Header */}
        <div 
          style={{ borderBottomColor: '#45203F' }}
          className="h-16 flex items-center justify-between px-6 border-b"
        >
          <div className="flex items-center gap-3">
            <div 
              style={{ backgroundColor: '#D94F7A' }}
              className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold text-lg shadow-sm"
            >
              HR
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">HR Connect</h1>
              <p className="text-[11px] text-pink-200/70 font-medium -mt-0.5">Management Portal</p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden text-pink-200 hover:text-white p-1 rounded-lg hover:bg-[#45203F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-pink-200/50 uppercase tracking-wider">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onClose) onClose();
                }}
                style={isActive ? { backgroundColor: '#D94F7A' } : {}}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-sm font-semibold'
                    : 'text-pink-100/80 hover:bg-[#45203F] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-200/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        <div 
          style={{ backgroundColor: '#45203F', borderTopColor: '#3B1E3A' }}
          className="p-4 border-t"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                style={{ backgroundColor: '#D94F7A' }}
                className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-xs"
              >
                {username ? username[0] : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{username || 'Admin'}</p>
                <p className="text-[11px] text-pink-200/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D94F7A] animate-pulse"></span>
                  Administrator
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{ borderColor: '#3B1E3A' }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-pink-100/80 hover:text-white hover:bg-[#3B1E3A] rounded-lg transition-colors border"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
