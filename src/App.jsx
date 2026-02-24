import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "./features/auth/authThunks";
import { selectAuthChecked } from "./features/auth/authSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const authChecked = useSelector(selectAuthChecked);
  const hasCheckedAuth = useRef(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!authChecked && !hasCheckedAuth.current) {
      dispatch(getCurrentUser());
      hasCheckedAuth.current = true;
    }
  }, [dispatch, authChecked]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;
    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-light text-dark transition-colors dark:bg-slate-900 dark:text-slate-100">
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
