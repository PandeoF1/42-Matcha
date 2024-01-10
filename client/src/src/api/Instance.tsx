import axios from "axios";

const defaultOptions = {
	baseURL: import.meta.env.VITE_URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
};

let instance = axios.create(defaultOptions);

instance.interceptors.request.use(function (config) {
	const token = localStorage.getItem('token');
	if (config.headers)
		config.headers.Authorization = token ? `Bearer ${token}` : '';
	return config;
});

export default instance;