const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Add these debug logs to check if env variables are loaded
console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);
console.log('GitHub Callback URL:', process.env.GITHUB_CALLBACK_URL);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Handle case where email might not be available
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
      let user = await User.findOne({ 
        $or: [
          { email: email },
          { githubId: profile.id }
        ]
      });
      
      if (user) {
        // Update user if needed
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = new User({
        name: profile.displayName || profile.username,
        email: email,
        password: crypto.randomBytes(16).toString('hex'),
        authProvider: 'github',
        githubId: profile.id
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport; 