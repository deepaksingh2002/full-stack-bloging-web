import { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "./features/auth/authThunks";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authChecked) {
      dispatch(getCurrentUser());
    }
  }, [authChecked, dispatch]);

//   useEffect(() => {
//   console.log("getCurrentUser fired");
//   dispatch(getCurrentUser());
// }, [dispatch]);


  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

 export default App;
