import React from 'react';

const StatCard = ({ title, value, icon, iconBg, iconColor, subtitle }) => {
  return (
    <div 
      style={{ borderColor: '#E5DDE2' }}
      className="bg-white p-5 sm:p-6 rounded-xl border shadow-xs hover:shadow-sm transition-all flex items-center justify-between"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#6B6870] uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-[#2D2D35] tracking-tight">{value}</h3>
        {subtitle && (
          <p className="text-xs text-[#6B6870]">{subtitle}</p>
        )}
      </div>
      <div 
        style={{ backgroundColor: iconBg || '#F8DCE5', color: iconColor || '#D94F7A' }}
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
