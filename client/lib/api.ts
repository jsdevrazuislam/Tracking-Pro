import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/constants";

export const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseURL = `${SERVER_URL}/api/v1`;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = Cookies.get(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    let customMessage = "An error occurred";
    if (status === 401) {
      customMessage = message;
    } else if (status === 403) {
      customMessage = message;
    } else if (status === 404) {
      customMessage = message;
    } else if (status >= 500) {
      customMessage = message;
    } else {
      customMessage = message;
    }

    return Promise.reject(new Error(customMessage));
  }
);
export default api;