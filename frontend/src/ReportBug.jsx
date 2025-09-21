import React, { useState } from 'react';
import axios from 'axios';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const ReportBug = ({ modalMode = false, onSubmitSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const submit = async () => {
    if (!title || !description) return;
    setStatus('sending');
    try {
      await axios.post(`${API_BASE_URL}/admin/bug`, {
        title,
        description,
        url: window.location.href,
        reporterEmail: email
      });
      setStatus('sent');
      setTitle(''); setDescription(''); setEmail('');
      if (onSubmitSuccess) setTimeout(onSubmitSuccess, 1200);
      setTimeout(()=>setStatus('idle'), 3000);
    } catch (err) {
      logger.error('Bug report submit failed', err);
      setStatus('error');
    }
  };

  return (
    <div className={modalMode ? '' : 'max-w-3xl mx-auto p-6 mt-12'}>
      <div className={modalMode ? '' : 'bg-white/5 border border-white/10 rounded p-6'}>
        <h3 className="text-lg font-semibold mb-2">Report a Bug</h3>
  <p className="text-gray-400 text-sm mb-4">Tell us what went wrong and where. We&apos;ll review it in the admin dashboard.</p>
        <input 
          placeholder="Title" 
          value={title} 
          onChange={(e)=>setTitle(e.target.value)} 
          className="w-full px-4 py-3 mb-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20"
          maxLength={100}
          aria-label="Bug Title"
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e)=>setDescription(e.target.value)} 
          rows={5} 
          className="w-full px-4 py-3 mb-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20 resize-none"
          maxLength={1000}
          aria-label="Bug Description"
        />
        <input 
          placeholder="Your email (optional)" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20"
          maxLength={254}
          aria-label="Your Email (optional)"
        />
        <div className="flex items-center space-x-2">
          <button 
            onClick={submit} 
            disabled={status==='sending'} 
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-2xl hover:from-pink-600 hover:to-red-600 active:scale-95 transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Submit Bug Report"
          >
            {status==='sending' ? 'Sending...' : 'Submit'}
          </button>
          {status==='sent' && <div className="text-green-400">Thanks — bug reported.</div>}
          {status==='error' && <div className="text-red-400">Failed to send. Try again later.</div>}
        </div>
      </div>
    </div>
  );
};

export default ReportBug;
