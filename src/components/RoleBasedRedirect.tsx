import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user is authenticated and we have profile data
    if (!loading && user && userProfile) {
      const currentPath = location.pathname;
      
      // If user is on login page or root, redirect based on role
      if (currentPath === '/' || currentPath === '/login') {
        if (isSuperAdmin || isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // If regular user tries to access admin, redirect to dashboard
      if (currentPath === '/admin' && !isAdmin && !isSuperAdmin) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // If admin/super admin is on regular dashboard, offer to go to admin
      // (but don't force redirect - they might want to see user view)
    }
  }, [user, userProfile, loading, isAdmin, isSuperAdmin, navigate, location.pathname]);

  return <>{children}</>;
};

export default RoleBasedRedirect;