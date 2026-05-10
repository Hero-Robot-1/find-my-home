import axios from 'axios';
import { serverUrl } from './index';

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.baseURL && !config.url?.startsWith('http')) {
        config.url = `${serverUrl()}${config.url}`;
    }
    return config;
});

export default api;
