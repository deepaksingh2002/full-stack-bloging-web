import { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "./features/auth/authThunks";
import { selectAuthLoading } from './features/auth/authSlice';

import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  useEffect(() => {
      dispatch(getCurrentUser());
  }, [dispatch]);

  // Global loader (important!)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Header />
      <main className="flex-1 mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
