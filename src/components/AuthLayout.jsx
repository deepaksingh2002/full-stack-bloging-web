import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication = true }) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // If route requires authentication and user is NOT authenticated => redirect to login
    if (authentication && !isAuthenticated) {
      navigate("/login");
    }

    // If route is for guests only (like login/signup) and user IS authenticated => redirect to home
    if (!authentication && isAuthenticated) {
      navigate("/");
    }

    setLoading(false);
  }, [authentication, isAuthenticated, navigate]);

  return loading ? <h1>Loading...</h1> : <>{children}</>;
}
