import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 3000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const newError = error;
    const { response = '' } = newError;

    const responseErrorMessage = response.data?.message;

    newError.message =
      responseErrorMessage || `서버 통신 중 오류가 발생하였습니다.\n(원인 : ${newError.message})`;

    return Promise.reject(newError);
  },
);

export default axiosInstance;
