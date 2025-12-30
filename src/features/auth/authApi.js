import axios from "axios";
const API = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: `${API}/api/v1/users`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network or CORS error
    if (!error.response) {
      return Promise.reject(error);
    }

    // Prevent infinite loop & skip refresh endpoint
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Cookies (refreshToken) sent automatically
        await api.post("/refresh-token");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Optional: logout user here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export const AuthService = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),

  currentUser: () => api.get("/currentUser"),
  profile: () => api.get("/profile"),

  updateProfile: (data) => api.patch("/update-profile", data),
  updateAvatar: (formData) =>
    api.patch("/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  changePassword: (data) => api.patch("/forget-password", data),
  refreshToken: () => api.post("/refresh-token"),
};

export default api;
