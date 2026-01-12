// Environment detection and configuration
(function () {
  "use strict";

  // Detect environment
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const isVercel = hostname.includes("vercel.app");
  const isProduction = !isLocal;

  // Set global environment variables
  window.ENV = {
    isLocal,
    isVercel,
    isProduction,
    hostname,
    origin: window.location.origin,

    // API Configuration
    API_BASE_URL: isLocal ? "http://localhost:3000" : window.location.origin,

    // Supabase Configuration (these should match your actual values)
    SUPABASE_URL: "https://yrzoxzxxnmkasisvqzld.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyem94enh4bm1rYXNpc3ZxemxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODMyNDcsImV4cCI6MjA4MzU1OTI0N30.RxZ72j61ABJXxkQibggBjOCs76IaH2yZkeVktZqZqeo",
  };

  // Helper functions
  window.ENV.getApiUrl = function (endpoint) {
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    return `${this.API_BASE_URL}/api/${cleanEndpoint}`;
  };

  window.ENV.log = function (message, data) {
    if (this.isLocal) {
      console.log(`[ENV] ${message}`, data || "");
    }
  };

  // Log environment info
  window.ENV.log("Environment detected:", {
    isLocal,
    isVercel,
    isProduction,
    hostname,
    apiBaseUrl: window.ENV.API_BASE_URL,
  });

  // Override fetch for API calls
  const originalFetch = window.fetch;
  window.fetch = function (url, options = {}) {
    // If URL starts with /api, make it absolute
    if (typeof url === "string" && url.startsWith("/api")) {
      url = window.ENV.getApiUrl(url.slice(4)); // Remove /api prefix
      window.ENV.log("Rewriting API URL to:", url);
    }

    // Add default headers
    const defaultOptions = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    return originalFetch(url, defaultOptions);
  };
})();
