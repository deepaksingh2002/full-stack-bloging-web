const BASE_URL = "https://college-blog-qlqp.onrender.com/api/v1/users";

export const authApi = {
    
  // Register user
  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    return res.json();
  },

  // Login user
  login: async (loginData) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    return res.json();
  },

  // Logout user
  logout: async () => {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    return res.json();
  },

  // Get current user
  currentUser: async () => {
    const res = await fetch(`${BASE_URL}/currentUser`, {
      method: "GET",
      credentials: "include",
    });

    return res.json();
  }
};
