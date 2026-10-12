import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getUserProfile } from '../utils/api';
import {
  AlertTriangle,
  LogOut,
  RefreshCw,
  User,
  Mail,
  Shield,
  Award,
  Calendar,
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user, token, logout, switchRole, quickDemoLogin, isAdmin, loading: authLoading } = useContext(UserContext);

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Fetch protected profile only when token exists
  const fetchProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await getUserProfile();
      setProfileData(data);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Handle switching role
  const handleSwitchRole = async () => {
    setIsSwitchingRole(true);
    const nextRole = isAdmin ? 'user' : 'admin';
    await switchRole(nextRole);
    setIsSwitchingRole(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#E8E8EA]">
              Developer Dashboard
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                isAdmin
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : 'bg-blue-950/40 text-blue-300 border-blue-800/50'
              }`}
            >
              {isAdmin ? 'ADMIN' : 'DEVELOPER'}
            </span>
          </div>
          <p className="text-xs text-[#8A8A8E]">
            {user ? (
              <>
                Logged in as <strong className="text-[#E8E8EA]">{user.name}</strong> ({user.email}) · Karma: <strong className="text-emerald-400">{user.karma || 100}</strong>
              </>
            ) : (
              <span>Not logged in</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={handleSwitchRole}
                disabled={isSwitchingRole}
                className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-xs px-3 py-1.5 rounded-lg text-[#E8E8EA] transition font-medium flex items-center gap-1.5 disabled:opacity-50"
                title="Switch account role"
              >
                <RefreshCw size={13} className={isSwitchingRole ? 'animate-spin' : ''} />
                <span>Switch to {isAdmin ? 'Developer' : 'Admin'}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                className="bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-xs px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5"
              >
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white text-xs px-3 py-1.5 rounded-lg transition font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Unauthenticated notice if no token */}
      {!token && !authLoading && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle size={16} className="shrink-0" />
            <span>You are not signed in. Please log in to view your profile and manage submissions.</span>
          </div>
          <button
            onClick={() => quickDemoLogin('user')}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-3 py-1 rounded-lg text-xs transition shrink-0"
          >
            Sign In as Developer
          </button>
        </div>
      )}

      {/* Account Info Details */}
      {user && (
        <div className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#242427] pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8E]">
              Account Overview
            </h3>
            {profileLoading && (
              <span className="text-[11px] text-[#8A8A8E]">Refreshing profile...</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0E0E10] border border-[#242427] p-3.5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[#8A8A8E] text-[11px]">
                <User size={13} className="text-[#4F9CF9]" />
                <span>User Name</span>
              </div>
              <span className="text-[#E8E8EA] font-medium text-sm block">
                {profileData?.name || user.name}
              </span>
            </div>

            <div className="bg-[#0E0E10] border border-[#242427] p-3.5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[#8A8A8E] text-[11px]">
                <Mail size={13} className="text-[#4F9CF9]" />
                <span>Email Address</span>
              </div>
              <span className="text-[#E8E8EA] font-medium text-sm block">
                {profileData?.email || user.email}
              </span>
            </div>

            <div className="bg-[#0E0E10] border border-[#242427] p-3.5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[#8A8A8E] text-[11px]">
                <Shield size={13} className="text-amber-400" />
                <span>Account Role</span>
              </div>
              <span className="text-[#4CAF6D] font-medium uppercase tracking-wide text-sm block">
                {profileData?.role || user.role}
              </span>
            </div>

            <div className="bg-[#0E0E10] border border-[#242427] p-3.5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[#8A8A8E] text-[11px]">
                <Award size={13} className="text-emerald-400" />
                <span>Developer Karma</span>
              </div>
              <span className="text-emerald-400 font-medium text-sm block">
                {(profileData?.karma || user.karma) || 100} Points
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}