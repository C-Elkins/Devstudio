import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import logger from './logger';
import { ArrowLeft } from 'lucide-react';

const SecureAdmin = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });
  // 2FA state and handlers
  const [twoFA, setTwoFA] = useState({ enabled: false, qr: '', otpauth: '' });
  const [twoFAToken, setTwoFAToken] = useState('');
  const [twoFAStatus, setTwoFAStatus] = useState('');

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
  const loadAdmins = React.useCallback(async () => {
    try {
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const res = await fetch(`${apiBase}/admin/list`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) return;
      const data = await res.json();
      setAdmins(data.data || []);
    } catch (err) {}
  }, [apiBase]);

  // 2FA setup/load status
  // eslint-disable-next-line no-unused-vars
  const load2FAStatus = async () => {
    try {
      setTwoFAStatus('');
      setTwoFA({ enabled: false, qr: '', otpauth: '' });
    } catch {}
  };

  const handle2FASetup = async () => {
    try {
      setTwoFAStatus('');
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const res = await fetch(`${apiBase}/admin/2fa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '2FA setup failed');
      setTwoFA({ enabled: false, qr: data.qr, otpauth: data.otpauth });
    } catch (err) {
      setTwoFAStatus('2FA setup failed: ' + (err.message || err));
    }
  };

  const handle2FAEnable = async () => {
    try {
      setTwoFAStatus('');
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const res = await fetch(`${apiBase}/admin/2fa/enable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ token: twoFAToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '2FA enable failed');
      setTwoFAStatus('2FA enabled!');
      setTwoFA({ ...twoFA, enabled: true });
    } catch (err) {
      setTwoFAStatus('2FA enable failed: ' + (err.message || err));
    }
  };

  const handle2FADisable = async () => {
    try {
      setTwoFAStatus('');
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const res = await fetch(`${apiBase}/admin/2fa/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ token: twoFAToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '2FA disable failed');
      setTwoFAStatus('2FA disabled.');
      setTwoFA({ enabled: false, qr: '', otpauth: '' });
    } catch (err) {
      setTwoFAStatus('2FA disable failed: ' + (err.message || err));
    }
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authData = localStorage.getItem('adminAuth');
        if (authData) {
          const parsed = JSON.parse(authData);
          const now = Date.now();
          if (parsed.authenticated && parsed.expires && now < parsed.expires) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        logger.error('Auth check error:', error);
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Load admins when authenticated
  useEffect(() => {
    if (isAuthenticated) loadAdmins();
  }, [isAuthenticated, loadAdmins]);


// ...existing code...

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  // logout handled inline where needed

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        {/* Back to Site Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Site
          </button>
        </div>
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  // Show admin management if authenticated
  const handleCreateAdmin = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create failed');
      setNewAdmin({ username: '', password: '', email: '' });
      await loadAdmins();
      alert('Admin created (if allowed).');
    } catch (err) {
      logger.error('Create admin error', err);
      alert('Could not create admin: ' + (err.message || err));
    }
  };

  const handleChangePassword = async (password) => {
    try {
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const res = await fetch(`${apiBase}/admin/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');
      alert('Password updated');
    } catch (err) {
      logger.error('Password change error', err);
      alert('Could not change password: ' + (err.message || err));
    }
  };

  const ChangePasswordForm = ({ onChange }) => {
    const [pw, setPw] = useState('');
    return (
      <div className="space-y-2">
        <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="New password" className="w-full p-2 bg-black/20 rounded" />
        <div className="flex space-x-2">
          <button onClick={()=>onChange(pw)} className="px-3 py-2 bg-blue-600 rounded">Change</button>
          <button onClick={()=>setPw('')} className="px-3 py-2 bg-gray-600 rounded">Clear</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 2FA Management */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
          <div className="bg-white/5 border border-white/10 rounded p-4 space-y-2">
            {twoFA.enabled ? (
              <>
                <div className="text-green-400">2FA is enabled for your account.</div>
                <input value={twoFAToken} onChange={e=>setTwoFAToken(e.target.value)} placeholder="Enter 2FA code to disable" className="w-full p-2 bg-black/20 rounded" />
                <button onClick={handle2FADisable} className="px-3 py-2 bg-red-600 rounded">Disable 2FA</button>
              </>
            ) : (
              <>
                {twoFA.qr ? (
                  <>
                    <div>Scan this QR code with your authenticator app:</div>
                    <div className="flex justify-center my-2">
                      <img src={twoFA.qr} alt="2FA QR" style={{ width: 180, height: 180, background: '#fff', padding: 8, borderRadius: 8 }} />
                    </div>
                    <input value={twoFAToken} onChange={e=>setTwoFAToken(e.target.value)} placeholder="Enter 2FA code from app" className="w-full p-2 bg-black/20 rounded" />
                    <button onClick={handle2FAEnable} className="px-3 py-2 bg-green-600 rounded">Enable 2FA</button>
                  </>
                ) : (
                  <button onClick={handle2FASetup} className="px-3 py-2 bg-blue-600 rounded">Setup 2FA</button>
                )}
              </>
            )}
            {twoFAStatus && <div className="text-yellow-400 mt-2">{twoFAStatus}</div>}
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold">Admin Management</div>
          <div className="flex items-center space-x-2">
            <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('adminAuth'); onBack(); }} className="px-3 py-2 bg-white/10 rounded">Back to Site</button>
            <button onClick={() => window.location.reload()} className="px-3 py-2 bg-purple-600 rounded">Open Dashboard</button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Existing Admins</h3>
          <div className="bg-white/5 border border-white/10 rounded p-4">
            <button onClick={loadAdmins} className="mb-3 px-3 py-1 bg-purple-600 rounded">Refresh</button>
            {admins.length === 0 ? <div className="text-gray-400">No admins found</div> : (
              <ul>
                {admins.map(a => (
                  <li key={a._id} className="py-1">{a.username} {a.email ? `— ${a.email}` : ''}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Create Admin (dev-safe)</h3>
          <div className="bg-white/5 border border-white/10 rounded p-4 space-y-2">
            <input value={newAdmin.username} onChange={(e)=>setNewAdmin(prev=>({...prev, username:e.target.value}))} placeholder="Username" className="w-full p-2 bg-black/20 rounded" />
            <input value={newAdmin.email} onChange={(e)=>setNewAdmin(prev=>({...prev, email:e.target.value}))} placeholder="Email" className="w-full p-2 bg-black/20 rounded" />
            <input value={newAdmin.password} onChange={(e)=>setNewAdmin(prev=>({...prev, password:e.target.value}))} placeholder="Password" type="password" className="w-full p-2 bg-black/20 rounded" />
            <div className="flex space-x-2">
              <button onClick={handleCreateAdmin} className="px-3 py-2 bg-green-600 rounded">Create</button>
              <button onClick={()=>setNewAdmin({username:'',password:'',email:''})} className="px-3 py-2 bg-gray-600 rounded">Clear</button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Change My Password</h3>
          <div className="bg-white/5 border border-white/10 rounded p-4">
            <ChangePasswordForm onChange={handleChangePassword} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecureAdmin;