import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';

const SettingsView = ({ currentUsername, onProfileUpdated }) => {
  const [username, setUsername] = useState(currentUsername || localStorage.getItem('username') || 'admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters long.');
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
          username: username.trim(),
          ...(password && { password }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      localStorage.setItem('username', data.username);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setSuccess('Admin credentials updated successfully!');
      setPassword('');
      setConfirmPassword('');
      if (onProfileUpdated) {
        onProfileUpdated(data.username);
      }
    } catch (err) {
      setError(err.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white p-5 rounded-xl border shadow-xs flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2D2D35]">Admin Account Settings</h2>
          <p className="text-xs text-[#6B6870] mt-0.5">
            Manage your administrative login credentials and system profile
          </p>
        </div>
        <div 
          style={{ backgroundColor: '#F8DCE5', color: '#D94F7A' }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs"
        >
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="bg-white rounded-xl border shadow-xs p-6"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#6B6870]" />
              <span>Admin Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
            />
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="pt-4 border-t space-y-4"
          >
            <div>
              <p className="text-xs font-semibold text-[#2D2D35]">Change Password</p>
              <p className="text-xs text-[#6B6870]">Leave blank if you do not wish to change your current password.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#6B6870]" />
                <span>New Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#6B6870]" />
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ borderColor: '#E5DDE2' }}
                className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#2D2D35] focus:outline-none focus:ring-2 focus:ring-[#D94F7A]"
              />
            </div>
          </div>

          <div 
            style={{ borderColor: '#E5DDE2' }}
            className="pt-4 border-t flex justify-end"
          >
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#D94F7A' }}
              className="px-5 py-2.5 hover:opacity-90 text-white rounded-lg transition-opacity shadow-sm text-sm font-semibold flex items-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
