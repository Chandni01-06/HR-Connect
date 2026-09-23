import React from 'react';

const Navbar = ({ onLogout, onOpenSettings, username }) => {
  return (
    <nav 
      style={{ backgroundColor: '#3B1E3A', borderBottomColor: '#45203F' }}
      className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 text-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div 
          style={{ backgroundColor: '#D94F7A' }}
          className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow-xs"
        >
          HR
        </div>
        <span className="text-xl font-bold text-white tracking-tight">HR Connect</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div 
            style={{ backgroundColor: '#D94F7A' }}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs"
          >
            {username ? username[0] : 'A'}
          </div>
          <span className="text-sm font-semibold text-white hidden sm:inline">{username}</span>
        </div>
        
        <button
          onClick={onOpenSettings}
          style={{ borderColor: '#45203F', backgroundColor: '#45203F' }}
          className="px-3 py-2 text-pink-100 hover:text-white rounded-lg border transition-colors text-sm font-medium flex items-center gap-1.5"
          title="Profile Settings"
        >
          <span className="hidden md:inline">Settings</span>
        </button>

        <button
          onClick={onLogout}
          style={{ backgroundColor: '#D94F7A' }}
          className="px-3.5 py-2 hover:opacity-90 text-white rounded-lg transition-opacity text-sm font-medium shadow-xs"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
