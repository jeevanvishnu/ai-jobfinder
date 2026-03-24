import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JobMatches from './pages/JobMatches';
import UploadResume from './pages/UploadResume';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/AuthSlice';
import type { AppDispatch, RootState } from './app/Store';

function App() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Prevent flashing login page while checking session
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin text-blue-600 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/job-matches' element={user ? <JobMatches /> : <Navigate to="/login" />} />
        <Route path='/upload-resume' element={user ? <UploadResume /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
