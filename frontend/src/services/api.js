import axios from 'axios';
const baseURL =  import.meta.env.VITE_BASE_URL;
const api = axios.create({
    baseURL: `${baseURL}/api/`,headers: {
        'ngrok-skip-browser-warning': '69420',
    }, 
    withCredentials: true, 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
        }
        return Promise.reject(error);
    }
);

export default api;