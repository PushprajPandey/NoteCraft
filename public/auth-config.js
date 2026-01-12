// OAuth Configuration for Vercel deployment
window.AuthConfig = {
  // Get the current domain for redirect URLs
  getRedirectUrl: function () {
    const origin = window.location.origin;
    // Never use localhost in production
    if (
      origin.includes("localhost") &&
      window.location.hostname.includes("vercel.app")
    ) {
      return `https://${window.location.hostname}`;
    }
    return origin;
  },

  // OAuth options for Supabase
  getOAuthOptions: function () {
    const redirectUrl = this.getRedirectUrl();
    console.log("OAuth redirect URL:", redirectUrl);

    return {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    };
  },

  // Handle OAuth callback from URL hash
  handleOAuthCallback: async function (supabase) {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);

    // Check for access token in hash (Supabase OAuth response)
    if (hash && hash.includes("access_token")) {
      console.log("OAuth callback detected in hash");
      try {
        // Supabase should automatically handle the session from the hash
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          console.log("OAuth session established:", data.session.user.email);
          // Clear the hash and redirect to clean URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return true;
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        return false;
      }
    }

    // Check for code in query params (alternative flow)
    const code = urlParams.get("code");
    if (code) {
      console.log("OAuth code detected in query params");
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (error) throw error;

        // Redirect to main app after successful auth
        window.location.href = "/";
        return true;
      } catch (error) {
        console.error("OAuth code exchange error:", error);
        return false;
      }
    }

    return false;
  },
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.AuthConfig;
}
