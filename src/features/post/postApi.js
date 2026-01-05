import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API}/api/v1/post`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data, 
  async (error) => {
    const originalRequest = error.config;

    // Access token expired -> try refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      statusCode: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data || null,
    });
  }
);


export const postService = {
  createPost: (postData) => api.post('/create-post', postData),
  getAllPosts: (params = {}) => api.get('/getAll-post', { params }),
  getPostById: (postId) => {
    if (!postId) {
      return Promise.reject({
        statusCode: 400,
        message: "Post Id is required",
      });
    }
    return api.get(`/get-post/${postId}`);
  },

  updatePost: (postId, postData) => {
    if (!postData || !postId) {
      return Promise.reject({
        statusCode: 400,
        message: "postId and data are required"
      });
    }
    return api.patch(`/update-post/${postId}`, postData);
  },
  deletePost: (postId) => {
    if (!postId) {
      return Promise.reject({
        statusCode: 400,
        message: 'Post id is required'
      });
    }
    return api.delete(`/delete-post/${postId}`)
  },
  searchPosts: (query) => {
    if (!query) {
      return Promise.reject({
        statusCode: 400,
        message: "Search query is required",
      });
    }
    return api.get("/search", {
      params: { q: query },
    });
  },
}