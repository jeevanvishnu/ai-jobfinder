import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/Store.ts'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { refreshAccessToken, logout } from './features/AuthSlice'

// Setup global Axios interceptors for handling refresh tokens seamlessly
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401, trying to refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept refresh-token loop or auth routes
      if (originalRequest.url?.includes('/refresh-token') || originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        // Succeeded! Retry original request
        return axios(originalRequest);
      } catch (err) {
        // Failed! Logout user
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
