// OAuth Configuration for Vercel deployment
window.AuthConfig = {
  // Get the current domain for redirect URLs
  getRedirectUrl: function () {
    const origin = window.location.origin;
    return `${origin}/auth/callback`;
  },

  // OAuth options for Supabase
  getOAuthOptions: function () {
    return {
      redirectTo: this.getRedirectUrl(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    };
  },

  // Handle OAuth callback
  handleOAuthCallback: async function (supabase) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (error) throw error;

        // Redirect to main app after successful auth
        window.location.href = "/";
        return true;
      } catch (error) {
        console.error("OAuth callback error:", error);
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
