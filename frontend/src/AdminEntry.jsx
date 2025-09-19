
import React, { useState, useRef } from 'react';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const STEPS = {
  CHOOSE: 'choose',
  PASTE: 'paste',
  SUCCESS: 'success',
  ERROR: 'error',
};

const AdminEntry = ({ onOpen }) => {
  const [step, setStep] = useState(STEPS.CHOOSE);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Try to auto-paste from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      setLoading(true);
      setError('');
      const text = await navigator.clipboard.readText();
      setToken(text);
      setStep(STEPS.PASTE);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    } catch (err) {
      setError('Could not read clipboard. Please paste manually.');
    } finally {
      setLoading(false);
    }
  };

  // Redeem invite
  const redeem = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const maybe = token.trim();
      const parsed = (maybe.includes('/')) ? maybe.split('/').pop() : maybe;
      const resp = await fetch(`${API_BASE_URL}/admin/redeem-invite`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: parsed }) });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Redeem failed');
      localStorage.setItem('adminInvite', JSON.stringify({ inviteSession: data.data.inviteSession, expires: Date.now() + 15 * 60 * 1000 }));
      setStep(STEPS.SUCCESS);
      setTimeout(() => { onOpen && onOpen(); }, 1200);
    } catch (err) {
      logger.error('Redeem failed', err);
      setError('Invalid or expired invite token.');
      setStep(STEPS.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Subtle animated background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-violet-600/20 to-purple-400/10 rounded-full blur-2xl animate-pulse-slower" />
      </div>
      <div className="max-w-md w-full z-10">
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10 animate-fade-in relative overflow-hidden">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-2 shadow-lg scale-100 hover:scale-105 transition-transform duration-300">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19v-6m0 0V5m0 8H6m6 0h6"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Access</h3>
            <p className="text-sm text-gray-200 mt-2 text-center">Enter your invite code to access the admin dashboard.</p>
          </div>

          {/* Animated step transitions */}
          <div className="transition-all duration-500 ease-in-out">
            {step === STEPS.CHOOSE && (
              <div className="flex flex-col items-center space-y-4 animate-fade-in">
                <button
                  className="w-full px-4 py-3 bg-purple-600/90 hover:bg-purple-700 active:scale-95 rounded-xl text-lg font-semibold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onClick={() => {
                    setStep(STEPS.PASTE);
                    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
                  }}
                >Paste Invite Code</button>
                <button
                  className="w-full px-4 py-3 bg-white/80 hover:bg-white active:scale-95 rounded-xl text-lg font-semibold text-purple-700 border border-purple-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
                  onClick={handlePasteFromClipboard}
                  disabled={loading}
                >Paste from Clipboard</button>
              </div>
            )}

            {step === STEPS.PASTE && (
              <div className="space-y-4 animate-slide-in-up">
                <input
                  ref={inputRef}
                  value={token}
                  onChange={e => setToken(e.target.value.toUpperCase())}
                  placeholder="Enter 8-char invite code"
                  className="w-full p-4 bg-black/40 rounded-xl text-lg tracking-widest text-center font-mono border border-white/10 focus:border-purple-400 outline-none shadow-inner transition-all duration-200 focus:ring-2 focus:ring-purple-400"
                  maxLength={16}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') redeem(); }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={redeem}
                    className="w-full px-4 py-3 bg-purple-600/90 hover:bg-purple-700 active:scale-95 rounded-xl text-lg font-semibold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                    disabled={loading}
                  >{loading ? 'Checking...' : 'Redeem'}</button>
                  <button
                    onClick={() => { setToken(''); setStep(STEPS.CHOOSE); setError(''); }}
                    className="w-full px-4 py-3 bg-gray-800/80 hover:bg-gray-900 active:scale-95 rounded-xl text-lg font-semibold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                    disabled={loading}
                  >Back</button>
                </div>
                {error && <div className="text-red-400 text-center mt-2 animate-fade-in animate-shake">{error}</div>}
              </div>
            )}

            {step === STEPS.SUCCESS && (
              <div className="flex flex-col items-center space-y-4 animate-fade-in">
                <div className="text-green-400 text-4xl animate-bounce">✔️</div>
                <div className="text-green-200 font-semibold text-lg animate-fade-in">Invite accepted! Opening admin...</div>
              </div>
            )}

            {step === STEPS.ERROR && (
              <div className="flex flex-col items-center space-y-4 animate-fade-in">
                <div className="text-red-400 text-4xl animate-shake">❌</div>
                <div className="text-red-200 font-semibold text-lg animate-fade-in">{error || 'Invalid or expired invite.'}</div>
                <button
                  onClick={() => { setToken(''); setStep(STEPS.PASTE); setError(''); }}
                  className="mt-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-900 active:scale-95 rounded-xl text-lg font-semibold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                >Try Again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEntry;
