import axios from 'axios';

const request = axios.create({ baseURL: process.env.API_URL, timeout: 3000 });

export default request;
