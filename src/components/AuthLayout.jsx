import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    // For protected routes, wait until auth bootstrap is complete.
    if (authentication && !authChecked) return;

    if (authentication && !isAuthenticated) {
      navigate("/login");
    }
    if (!authentication && isAuthenticated) {
      navigate("/");
    }
  }, [authentication, isAuthenticated, authChecked, navigate]);

  if (authentication && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
