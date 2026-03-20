import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import type { RootState } from './app/Store';
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/upload-resume' element={user ? <UploadResume /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
