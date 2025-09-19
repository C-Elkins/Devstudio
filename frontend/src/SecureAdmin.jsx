import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import logger from './logger';
import { ArrowLeft } from 'lucide-react';

const SecureAdmin = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const now = Date.now();
        
        // Check if the session is still valid (not expired)
        if (parsed.authenticated && parsed.expires && now < parsed.expires) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear it
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

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    // Also go back to main site
    if (onBack) {
      onBack();
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }

  // Show login form if not authenticated
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

  // Show admin dashboard if authenticated
  return <AdminDashboard onLogout={handleLogout} />;
};

export default SecureAdmin;