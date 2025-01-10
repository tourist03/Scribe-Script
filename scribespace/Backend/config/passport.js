const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');
const oauthConfig = require('./oauth');

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

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: oauthConfig.google.clientID,
    clientSecret: oauthConfig.google.clientSecret,
    callbackURL: oauthConfig.google.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }

      // If not, create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'), // Generate random password
        authProvider: 'google'
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: oauthConfig.github.clientID,
    clientSecret: oauthConfig.github.clientSecret,
    callbackURL: oauthConfig.github.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'),
        authProvider: 'github'
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: oauthConfig.microsoft.clientID,
    clientSecret: oauthConfig.microsoft.clientSecret,
    callbackURL: oauthConfig.microsoft.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'),
        authProvider: 'microsoft'
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport; 