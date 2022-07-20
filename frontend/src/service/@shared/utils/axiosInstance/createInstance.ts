import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 3000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const newError = error;

    newError.message = error.response.data.message || newError.message;
    return Promise.reject(newError);
  },
);

export default axiosInstance;
