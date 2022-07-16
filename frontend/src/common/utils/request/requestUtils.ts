import { AxiosInstance } from 'axios';

export const setAccessTokenHeader = (enable: boolean, axiosInstance: AxiosInstance) => {
  const setHeader = axiosInstance.defaults.headers;

  enable
    ? (setHeader.common['Authorization'] = 'Bearer {액세스토큰이 입력될 곳}')
    : delete setHeader.common['Authorization'];
};
