import React, { useState } from 'react';
import { Users, Lock, User, ArrowRight } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password');
      }

      // Save token and username in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Server connection failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3F4] px-4">
      <div 
        style={{ borderColor: '#E5DDE2' }}
        className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div 
            style={{ backgroundColor: '#3B1E3A' }} 
            className="inline-flex p-3 text-white rounded-xl mb-3 shadow-md border border-[#45203F]"
          >
            <Users className="w-8 h-8 text-[#D94F7A]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2D2D35] tracking-tight">HR Connect</h2>
          <p className="mt-1 text-xs text-[#6B6870]">Human Resources & Employee Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#6B6870]" />
              <span>Admin Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-[#F5F3F4] border rounded-lg text-[#2D2D35] placeholder-[#6B6870] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#6B6870]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ borderColor: '#E5DDE2' }}
              className="w-full px-3.5 py-2.5 bg-[#F5F3F4] border rounded-lg text-[#2D2D35] placeholder-[#6B6870] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F7A] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#D94F7A' }}
            className="w-full mt-2 py-2.5 px-4 hover:opacity-90 text-white font-semibold rounded-lg transition-opacity shadow-sm active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Evaluation Credentials Helper */}
        <div 
          style={{ borderColor: '#E5DDE2' }}
          className="mt-8 text-center border-t pt-5"
        >
          <p className="text-xs text-[#6B6870]">
            Evaluation Demo Credentials:<br />
            Username: <code style={{ backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }} className="border px-1.5 py-0.5 rounded font-mono font-bold">admin</code> &nbsp;|&nbsp; 
            Password: <code style={{ backgroundColor: '#F8DCE5', color: '#D94F7A', borderColor: '#E5DDE2' }} className="border px-1.5 py-0.5 rounded font-mono font-bold">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
