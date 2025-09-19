import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, RefreshCw } from 'lucide-react';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const AdminDashboard = ({ onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [metrics, setMetrics] = useState({ totalContacts: 0, unresponded: 0, recentBugs: [] });
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const auth = localStorage.getItem('adminAuth');
        const token = auth ? JSON.parse(auth).token : null;
        const response = await api.get('/contact', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setContacts(response.data.data || []);
        setError('');
      } catch (err) {
        logger.error('Error fetching contacts:', err);
        setError('Failed to load contact submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
    // also fetch dashboard metrics and recent bugs
    const fetchDashboard = async () => {
      try {
        const auth = localStorage.getItem('adminAuth');
        const token = auth ? JSON.parse(auth).token : null;
        const resp = await api.get('/admin/dashboard', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (resp.data && resp.data.data) setMetrics(resp.data.data);
      } catch (err) {
        logger.error('Error fetching dashboard metrics', err);
      }
    };

    const fetchBugs = async () => {
      try {
        const auth = localStorage.getItem('adminAuth');
        const token = auth ? JSON.parse(auth).token : null;
        const resp = await api.get('/admin/bugs', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (resp.data && resp.data.data) setBugs(resp.data.data);
      } catch (err) {
        logger.error('Error fetching bugs', err);
      }
    };

    fetchDashboard();
    fetchBugs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    onLogout();
  };

  const refreshContacts = async () => {
    try {
      setLoading(true);
      const auth = localStorage.getItem('adminAuth');
      const token = auth ? JSON.parse(auth).token : null;
      const response = await api.get('/contact', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setContacts(response.data.data || []);
      setError('');
    } catch (err) {
      logger.error('Error fetching contacts:', err);
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500';
      case 'Contacted': return 'bg-green-500';
      case 'In Discussion': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Contact Form Submissions</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshContacts}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">Contact Submissions ({contacts.length})</h2>
            <div className="text-sm text-gray-400 mt-1">Total contacts: {metrics.totalContacts ?? contacts.length} • Unresponded: {metrics.unresponded ?? contacts.filter(c=>!c.responded).length}</div>
          </div>

          {contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No contact submissions yet.</p>
              <p className="text-sm mt-2">Test the contact form to see submissions appear here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{contact.name}</div>
                        {contact.company && (
                          <div className="text-sm text-gray-400">{contact.company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <a href={`mailto:${contact.email}`} className="hover:text-purple-400 transition-colors">
                          {contact.email}
                        </a>
                        {contact.phone && (
                          <div className="text-xs text-gray-400">{contact.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        <div className="truncate" title={contact.message}>
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-purple-400">{metrics.totalContacts ?? contacts.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">New Messages</h3>
            <p className="text-3xl font-bold text-blue-400">
              {contacts.filter(c => c.status === 'New').length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Response Rate</h3>
            <p className="text-3xl font-bold text-green-400">
              {contacts.length > 0 
                ? Math.round((contacts.filter(c => c.responded).length / contacts.length) * 100)
                : 0
              }%
            </p>
          </div>
        </div>

        {/* Recent Bugs */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Recent Bug Reports</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            {bugs.length === 0 ? (
              <div className="text-gray-400">No bug reports yet.</div>
            ) : (
              <ul className="space-y-3">
                {bugs.slice(0,10).map(b => (
                  <li key={b._id} className="p-3 bg-black/10 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-sm text-gray-400">{b.reporterEmail || 'Anonymous'} • {new Date(b.createdAt).toLocaleString()}</div>
                        <div className="text-gray-300 mt-2">{b.description}</div>
                        {b.url && <div className="text-xs text-purple-300 mt-2 truncate">{b.url}</div>}
                      </div>
                      <div className="text-sm text-gray-300">{b.status || 'new'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;