import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

// ✅ Request Interceptor (Attach Access Token)
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

// ✅ Response Interceptor (Auto Refresh Token)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      try {
        // 🔄 Refresh Token API Call
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/login/refresh`, {}, { withCredentials: true });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(error.config);
      } catch (err) {
        console.error("Refresh token expired, logging out...");
        localStorage.removeItem("accessToken"); // ❌ Clear token
        window.location.href = "/login"; // 🔄 Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default API;
