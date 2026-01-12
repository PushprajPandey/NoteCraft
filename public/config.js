// API Configuration for different environments
window.AppConfig = {
  // Determine the API base URL based on environment
  getApiBaseUrl: function () {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Local development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000";
    }

    // Vercel deployment
    if (hostname.includes("vercel.app")) {
      return `${protocol}//${hostname}`;
    }

    // Default to current origin
    return window.location.origin;
  },

  // Get full API URL
  getApiUrl: function (endpoint) {
    const baseUrl = this.getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}/api${cleanEndpoint}`;
  },

  // Fetch wrapper with proper error handling
  fetch: async function (endpoint, options = {}) {
    const url = this.getApiUrl(endpoint);

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      console.log(`Making API call to: ${url}`);
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  },
};

// Make it globally available
window.api = window.AppConfig;

console.log("API Base URL:", window.AppConfig.getApiBaseUrl());
