import axios from "axios";

const api = axios.create({
  baseURL: "https://college-blog-qlqp.onrender.com/api/v1",
  // important for cookies (session)
  withCredentials: true, 
});

export default api;
