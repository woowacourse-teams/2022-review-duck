import axios from 'axios';

import { API_REQUEST_TIMEOUT } from 'constant';

const axiosInstance = axios.create({
  baseURL: import.meta.env.CLIENT_API_URL,
  timeout: API_REQUEST_TIMEOUT,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const newError = error;
    const { response = '' } = newError;

    const responseErrorMessage = response.data?.message;

    newError.message = responseErrorMessage || `서버 통신 중 오류가 발생하였습니다.\n(원인 : ${newError.message})`;

    return Promise.reject(newError);
  },
);

export default axiosInstance;
