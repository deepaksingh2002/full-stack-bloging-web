import axios from "axios";

const api = axios.create({
  baseURL: 'https://college-blog-qlqp.onrender.com/api/v1/post',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - FIXED
api.interceptors.response.use(
  (response) => response.data, // Return response.data directly
  (error) => {
    const err = {
      statusCode: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data || null
    }
    console.error("api Error: ", err);
    return Promise.reject(err); // CRITICAL: Always reject to propagate error
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