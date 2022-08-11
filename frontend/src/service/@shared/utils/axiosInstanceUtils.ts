import axiosInstance from 'service/@shared/api/config/axiosInstance';

const getHeader = (key: string) => {
  return axiosInstance.defaults.headers.common[key];
};

const setHeader = (key: string, value: string) => {
  axiosInstance.defaults.headers.common[key] = value;
};

const removeHeader = (key: string) => {
  if (!axiosInstance.defaults.headers.common[key]) return;

  delete axiosInstance.defaults.headers.common[key];
};

const axiosInstanceUtils = { getHeader, setHeader, removeHeader };

export default axiosInstanceUtils;
