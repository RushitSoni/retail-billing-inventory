import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

//Request Interceptor (Attach Access Token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Response Interceptor (Auto Refresh Token)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //Prevent infinite loop by checking a flag
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/login/refresh")
    ) {
      originalRequest._retry = true; // Mark as retried once

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/login/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest); //Retry once only

      } catch (err) {
        console.error("Refresh token expired, logging out...");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error); // Don't retry more than once
  }
);


export default API;
