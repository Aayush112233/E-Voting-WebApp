import axios from "axios";
import { getCookie } from "./config/storageUtil";

// FOR ADMIN LOGIN
export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

API.interceptors.request.use(
  (config) => {
    const Token = getCookie("token");

    if (Token) {
      config.headers.Authorization = `Bearer ${Token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
