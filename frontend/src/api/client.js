import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    headers: {
        // "Content-Type": "application/json", // sending data as json 
        Accept: "application/json",         // accepting data as json
    },
});

//
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/auth/me');

    // ONLY redirect on 401 if it's NOT the initial auth check
    if (error.response?.status === 401 && !isAuthCheck) {
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);