import axios from 'axios';
import { config } from "./constants";

const apiClient = axios.create({
    baseURL: `${config.baseUrl}/api`,
});

// Attach the token to the Authorization header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    get: (url, config) => apiClient.get(url, config),
    post: (url, data, config) => apiClient.post(url, data, config),
    put: (url, data, config) => apiClient.put(url, data, config),
    delete: (url, config) => apiClient.delete(url, config),
    patch: (url, data, config) => apiClient.patch(url, data, config),
};

export default apiClient;