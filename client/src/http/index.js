import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

const accessToken = localStorage.getItem('access_token');
if (accessToken) axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export default axios;