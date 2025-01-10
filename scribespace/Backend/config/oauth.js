const oauthConfig = {
  google: {
    clientID: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    callbackURL: "http://localhost:5001/api/auth/google/callback"
  },
  github: {
    clientID: "YOUR_GITHUB_CLIENT_ID",
    clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
    callbackURL: "http://localhost:5001/api/auth/github/callback"
  },
  microsoft: {
    clientID: "YOUR_MICROSOFT_CLIENT_ID",
    clientSecret: "YOUR_MICROSOFT_CLIENT_SECRET",
    callbackURL: "http://localhost:5001/api/auth/microsoft/callback"
  }
};

module.exports = oauthConfig; 