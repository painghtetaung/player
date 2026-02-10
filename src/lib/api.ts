import axios from "axios";

const API_URL = import.meta.env.VITE_BALLDONTLIE_API_URL;
const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;

export const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	},
);
