import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getUserProfile, testAdminRoute } from '../utils/api';
import {
  AlertTriangle,
  LogOut,
  RefreshCw,
  User,
  Mail,
  Shield,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Terminal,
  Key,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user, token, logout, switchRole, quickDemoLogin, isAdmin, loading: authLoading } = useContext(UserContext);

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingEndpoint, setTestingEndpoint] = useState(null);

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

  // Test Protected Profile API (EXP NO. 5)
  const handleTestProfile = async () => {
    setTestingEndpoint('profile');
    try {
      const res = await getUserProfile();
      setTestResult({
        endpoint: 'GET /api/users/profile',
        status: 200,
        data: res,
        explanation: 'JWT Bearer token was successfully verified by authMiddleware (EXP NO. 5).',
      });
    } catch (err) {
      setTestResult({
        endpoint: 'GET /api/users/profile',
        status: err.status || 401,
        message: err.message,
        explanation: 'Access Denied: Token missing or invalid (EXP NO. 5).',
      });
    } finally {
      setTestingEndpoint(null);
    }
  };

  // Test Admin Route with Role-Based Access Control (EXP NO. 6)
  const handleTestAdmin = async () => {
    setTestingEndpoint('admin');
    try {
      const res = await testAdminRoute();
      setTestResult({
        endpoint: 'GET /api/users/admin-dashboard',
        status: 200,
        data: res,
        explanation: 'Admin authorization verified! User has admin role in JWT (EXP NO. 6).',
      });
    } catch (err) {
      setTestResult({
        endpoint: 'GET /api/users/admin-dashboard',
        status: err.status || 403,
        message: err.message || 'Forbidden: Admin privileges required.',
        explanation: 'RBAC Active: Regular student rejected with HTTP 403 because role !== "admin" (EXP NO. 6).',
      });
    } finally {
      setTestingEndpoint(null);
    }
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

      {/* Interactive Lab Viva Evaluation Test Bench (EXP NO. 5 & 6) */}
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#242427] pb-3">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-[#4F9CF9]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E8E8EA]">
              Lab Evaluation Test Bench (EXP NO. 5 & 6)
            </h3>
          </div>
          <span className="text-[11px] text-[#8A8A8E] font-mono">
            {token ? 'Authorization: Bearer <JWT>' : 'No Token'}
          </span>
        </div>

        <p className="text-xs text-[#8A8A8E] leading-relaxed">
          Test JWT authentication and Role-Based Access Control (RBAC). A student token returns{' '}
          <strong className="text-emerald-400">HTTP 200</strong> on Profile and{' '}
          <strong className="text-amber-400">HTTP 403 Forbidden</strong> on Admin routes. An Admin token returns{' '}
          <strong className="text-emerald-400">HTTP 200</strong> on both.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleTestProfile}
            disabled={testingEndpoint !== null}
            className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-sky-400 text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Key size={13} />
            <span>Test Protected Profile (EXP 5)</span>
          </button>

          <button
            onClick={handleTestAdmin}
            disabled={testingEndpoint !== null}
            className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-amber-300 text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <ShieldAlert size={13} />
            <span>Test Admin Route (EXP 6)</span>
          </button>
        </div>

        {testResult && (
          <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#242427] pb-1.5">
              <span className="text-[#8A8A8E]">{testResult.endpoint}</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  testResult.status === 200
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                    : 'bg-amber-950/50 text-amber-300 border border-amber-800/50'
                }`}
              >
                HTTP {testResult.status} {testResult.status === 200 ? 'OK' : 'FORBIDDEN'}
              </span>
            </div>
            <pre className="text-[11px] text-[#E8E8EA] overflow-x-auto p-1 leading-relaxed">
              {JSON.stringify(testResult.data || { error: testResult.message }, null, 2)}
            </pre>
            <p className="text-[11px] text-[#8A8A8E] font-sans pt-1 border-t border-[#242427]">
              💡 <strong>Viva Note:</strong> {testResult.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}