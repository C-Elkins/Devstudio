import React, { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import ReportBug from './ReportBug';

const ReportBugFloating = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Slide in/peek logic: peek by default, fully show near bottom or on hover
  const [peek, setPeek] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      // Fully show if within 300px of bottom
      setShow(scrollY + windowHeight >= docHeight - 300);
      setPeek(!(scrollY + windowHeight >= docHeight - 300));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <button
        className={`fixed bottom-6 right-0 z-50 flex items-center px-5 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-full text-white font-semibold shadow-2xl text-lg gap-2 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-pink-400
        ${peek && !show ? 'translate-x-2/3 opacity-60 hover:translate-x-0 hover:opacity-100' : 'translate-x-0 opacity-100'}
        `}
        style={{
          right: peek && !show ? '-2.5rem' : '1.5rem',
          boxShadow: peek && !show ? '0 4px 24px -4px rgba(255,0,0,0.12)' : '0 8px 32px -4px rgba(255,0,0,0.18)',
          pointerEvents: show || peek ? 'auto' : 'none',
        }}
        onMouseEnter={()=>setPeek(false)}
        onMouseLeave={()=>setPeek(!(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 300))}
        onClick={() => setShowModal(true)}
        aria-label="Report a Bug"
        tabIndex={0}
      >
        <Bug className="w-5 h-5" />
        <span className="hidden sm:inline">Report Bug</span>
      </button>
  {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={()=>setShowModal(false)} aria-label="Close bug report modal" />
          <div className="relative bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl p-0 w-full max-w-lg mx-4 animate-modal-in">
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
              onClick={()=>setShowModal(false)}
              aria-label="Close bug report modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="p-8 pt-12">
              <ReportBug modalMode onSubmitSuccess={()=>setShowModal(false)} />
            </div>
          </div>
          <style>{`
            .animate-fade-in { animation: fade-in 0.3s cubic-bezier(0.25,0.46,0.45,0.94); }
            .animate-modal-in { animation: modal-in 0.4s cubic-bezier(0.25,0.46,0.45,0.94); }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes modal-in { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ReportBugFloating;