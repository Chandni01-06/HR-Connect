import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername(localStorage.getItem('username') || '');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username) {
      setError('Username cannot be empty.');
      return;
    }

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          ...(password && { password }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      localStorage.setItem('username', data.username);
      localStorage.setItem('token', data.token);

      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        onProfileUpdated(data.username);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border overflow-hidden transform transition-all animate-in fade-in zoom-in duration-150"
      >
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="px-6 py-4 bg-[#F5F3F4] border-b flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-[#2D2D35]">Admin Profile Settings</h3>
            <p className="text-xs text-[#6B6870]">Update administrator credentials</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
            />
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="border-t pt-4"
          >
            <p className="text-xs text-[#6B6870] mb-3">Leave blank if you don't want to change password:</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ borderColor: '#E5DDE2' }}
                  className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ borderColor: '#E5DDE2' }}
                  className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
                />
              </div>
            </div>
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="pt-4 border-t flex justify-end gap-3"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#D94F7A' }}
              className="px-4 py-2 hover:opacity-90 text-white rounded-lg transition-opacity shadow-sm text-sm font-semibold active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
