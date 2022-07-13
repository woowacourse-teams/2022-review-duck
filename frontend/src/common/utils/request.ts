import { QueryOptions } from 'react-query';

import axios, { AxiosRequestConfig } from 'axios';

const request = (url: string, axiosOptions: AxiosRequestConfig) => (queryOptions: QueryOptions) =>
  axios(process.env.API_URL + url, axiosOptions);

export default request;
