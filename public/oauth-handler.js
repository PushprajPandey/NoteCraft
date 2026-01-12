// OAuth Callback Handler for Supabase
(function () {
  "use strict";

  // Check if we're on the OAuth callback
  function isOAuthCallback() {
    const hash = window.location.hash;
    const search = window.location.search;

    return (
      (hash && hash.includes("access_token")) ||
      (search && search.includes("code="))
    );
  }

  // Extract token from hash
  function extractTokenFromHash() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
      expires_in: params.get("expires_in"),
      token_type: params.get("token_type"),
    };
  }

  // Handle OAuth callback
  async function handleOAuthCallback() {
    if (!isOAuthCallback()) return false;

    console.log("OAuth callback detected");

    try {
      // Wait for Supabase to be available
      let attempts = 0;
      while (!window.supabase && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.supabase) {
        console.error("Supabase client not available");
        return false;
      }

      // Check if we have a hash with tokens
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        console.log("Processing OAuth tokens from hash");

        // Supabase should automatically handle the session from the hash
        // Just wait a moment for it to process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { data, error } = await window.supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          return false;
        }

        if (data.session) {
          console.log(
            "OAuth session established for:",
            data.session.user.email
          );

          // Clear the hash and redirect to clean URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Trigger a custom event to notify the app
          window.dispatchEvent(
            new CustomEvent("oauth-success", {
              detail: { user: data.session.user },
            })
          );

          return true;
        }
      }

      // Handle code-based flow
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        console.log("Processing OAuth code");
        const { data, error } =
          await window.supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Code exchange error:", error);
          return false;
        }

        if (data.session) {
          console.log(
            "OAuth session established via code for:",
            data.session.user.email
          );

          // Clean URL and redirect
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Trigger success event
          window.dispatchEvent(
            new CustomEvent("oauth-success", {
              detail: { user: data.session.user },
            })
          );

          return true;
        }
      }
    } catch (error) {
      console.error("OAuth callback handling error:", error);

      // Trigger error event
      window.dispatchEvent(
        new CustomEvent("oauth-error", {
          detail: { error: error.message },
        })
      );

      return false;
    }

    return false;
  }

  // Auto-handle OAuth callback on page load
  window.addEventListener("load", () => {
    if (isOAuthCallback()) {
      console.log("OAuth callback page detected, processing...");
      handleOAuthCallback();
    }
  });

  // Make handler available globally
  window.handleOAuthCallback = handleOAuthCallback;
})();
