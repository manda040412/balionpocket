import axios from 'axios';
import { config } from "./constants";
import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
    baseURL: `${config.baseUrl}/api`,
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    }
});

// Attach the token to the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log("Unauthenticated, please try login");
        }

        return config;
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if the error is an Axios error and has a 401 status
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Handle the unauthorized response
            window.location.href = '/login'; // Or use a routing library like React Router's history.push('/login')

            // You can also clear local storage or cookies related to authentication
            localStorage.removeItem('authToken');
            // Optional: Prevent further processing of the error in subsequent .catch() blocks
            return Promise.reject('Unauthorized');
        }
        // For other errors, re-throw the error so it can be handled by specific .catch() blocks
        return Promise.reject(error);
    }
)

export const api = {
    get: (url, config) => apiClient.get(url, config),
    post: (url, data, config) => apiClient.post(url, data, config),
    put: (url, data, config) => apiClient.put(url, data, config),
    delete: (url, config) => apiClient.delete(url, config),
    patch: (url, data, config) => apiClient.patch(url, data, config),
};

export default apiClient;