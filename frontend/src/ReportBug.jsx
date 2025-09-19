import React, { useState } from 'react';
import axios from 'axios';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const ReportBug = () => {
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
      setTimeout(()=>setStatus('idle'), 3000);
    } catch (err) {
      logger.error('Bug report submit failed', err);
      setStatus('error');
    }
  };

  return (
    <div id="report-bug" className="max-w-3xl mx-auto p-6 mt-12">
      <div className="bg-white/5 border border-white/10 rounded p-6">
        <h3 className="text-lg font-semibold mb-2">Report a Bug</h3>
        <p className="text-gray-400 text-sm mb-4">Tell us what went wrong and where. We'll review it in the admin dashboard.</p>
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-2 mb-2 bg-black/20 rounded" />
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} rows={5} className="w-full p-2 mb-2 bg-black/20 rounded" />
        <input placeholder="Your email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 mb-4 bg-black/20 rounded" />
        <div className="flex items-center space-x-2">
          <button onClick={submit} disabled={status==='sending'} className="px-4 py-2 bg-red-600 rounded text-white">{status==='sending' ? 'Sending...' : 'Submit'}</button>
          {status==='sent' && <div className="text-green-400">Thanks — bug reported.</div>}
          {status==='error' && <div className="text-red-400">Failed to send. Try again later.</div>}
        </div>
      </div>
    </div>
  );
};

export default ReportBug;
