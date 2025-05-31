import axios from "axios";

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: "http://localhost:3050",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login - implement based on your app's routing
      if (typeof window !== "undefined") {
        // Check if we're in the browser context
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signUp: (userData) => api.post("/auth/public/sign-up", userData),
  login: (credentials) => api.post("/auth/public/sign-in", credentials),
  authMe: () => api.get("/auth/me"),
};

// Quiz APIs
export const quizAPI = {
  getQuiz: (category, difficulty, count) =>
    api.get(
      `/questions/public?subCategoryId=${category}&questionCount=${count}&difficulty=${difficulty}`
    ),
  getLevelingQuiz: () => api.get("/questions/public/leveling"),
};

export const categoryAPI = {
  getCategories: () => api.get("/categories/public"),
};
// User APIs - example for future implementation
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (userData) => api.put("/user/profile", userData),
};

export default api;
