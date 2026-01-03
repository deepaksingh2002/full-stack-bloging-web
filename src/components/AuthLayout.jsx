import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// export default function Protected({ children, authentication = true }) {

//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   useEffect(() => {
//     if (authentication && !isAuthenticated) {
//       navigate("/login");
//     }
//     if (!authentication && isAuthenticated) {
//       navigate("/");
//     }

//     setLoading(false);
//   }, [authentication, isAuthenticated, navigate]);

//   return loading ? <h1>Loading...</h1> : <>{children}</>;
// }

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authChecked) return;

    if (authentication && !isAuthenticated) {
      navigate("/login");
    }
    if (!authentication && isAuthenticated) {
      navigate("/");
    }
  }, [authentication, isAuthenticated, authChecked, navigate]);

  if (!authChecked) return <h1>Loading...</h1>;

  return <>{children}</>;
}
