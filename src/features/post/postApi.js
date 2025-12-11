const BASE_URL = "https://college-blog-qlqp.onrender.com/api/v1/post";

const request = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  
  // ERROR HANDLING - Check HTTP status
  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(errorData.message || `HTTP ${res.status}`);
    error.statusCode = res.status;
    throw error;
  }
  
  return res.json();
};

export const postService = {
  createPost: (data) => request(`${BASE_URL}/create-post`, "POST", data),
  getAllPosts: () => request(`${BASE_URL}/getAll-post`, "GET"),
  getPostById: (postId) => request(`${BASE_URL}/get-post/${postId}`, "GET"),
  updatePost: (postId, data) => request(`${BASE_URL}/update-post/${postId}`, "PUT", data),
  deletePost: (postId) => request(`${BASE_URL}/delete-post/${postId}`, "DELETE"),
};
