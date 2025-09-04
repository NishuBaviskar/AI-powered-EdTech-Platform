import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    // The base URL for all our API calls will be '/api'
    // The Vite proxy will handle forwarding this to http://localhost:3001
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// IMPORTANT: This "interceptor" runs before each request is sent.
// It checks if a token exists in localStorage and, if so, adds it
// to the Authorization header.
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;