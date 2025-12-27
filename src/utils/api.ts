import axios from "axios";

// Use environment variable or fallback to production URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://akili-backend.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== "undefined") {
      try {
        const authData = localStorage.getItem("authData");
        if (authData) {
          const parsedData = JSON.parse(authData);
          if (parsedData.token) {
            config.headers.Authorization = `Bearer ${parsedData.token}`;
            console.log("✅ Added auth token to request");
          }
        }
      } catch (error) {
        console.error("Error reading auth token from localStorage:", error);
      }
    }

    // ✅ Log the actual request being made
    console.log("📤 Making request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      // ✅ Check if it's a network error
      isNetworkError: !error.response,
      // ✅ Check CORS
      isCorsError:
        error.message?.includes("CORS") || error.message?.includes("Network"),
    });

    // Handle 401 errors specifically
    if (error.response?.status === 401) {
      // Token is invalid/expired - clear it
      if (typeof window !== "undefined") {
        localStorage.removeItem("authData");
      }
      console.warn("🔐 Authentication failed - token cleared");
    }

    return Promise.reject(error);
  }
);

export default api;
