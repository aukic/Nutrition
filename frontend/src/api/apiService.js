import axios from "axios";

const apiService = axios.create({
    baseURL: "https://nutrition-i9jn.onrender.com",
});

apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            globalThis.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiService;
