const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = "$cr!be$p@ceJ%T$*cr&t";

//Route 1 : Create a user using : POST "/api/auth/createuser" , No login required

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 4 }),
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password must be atlease 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors then return bad request
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({success ,  error: error.array() });
    }

    //if user already exist return error and bad request

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ success , error: "User with this email already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create new user after all the above checks
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success , authToken });
    } catch (error) {
      res.status(500).send(success , "Internal server Error Occured");
    }
  }
);

//Route 2 : Authenticate a user using : POST "/api/auth/login" , No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Login with correct credentials" });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res.status(400).json({ success, error: "Login with correct credentials" });
      }
      const data = {
        user: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).send("Internal server Error Occured");
    }
  }
);

//Route 3 : Get LoggedIn user Details : POST "/api/auth/getuser" , Login required

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server Error Occured");
  }
});

// Add these routes after your existing routes
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
      }
    });

    // Send reset email
    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'ScribeSpace Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Social Auth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

// Callback Routes
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ user: { id: req.user.id } }, JWT_SECRET);
    res.redirect(`http://localhost:3000/auth-callback?token=${token}`);
  }
);

// GitHub callback route
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: 'https://scribe-script.vercel.app/login',
    session: false 
  }),
  function(req, res) {
    try {
      const token = jwt.sign({ user: { id: req.user.id } }, JWT_SECRET);
      res.redirect(`https://scribe-script.vercel.app/login?token=${token}`);
    } catch (error) {
      res.redirect('https://scribe-script.vercel.app/login');
    }
  }
);

// Similar callback routes for Microsoft...

module.exports = router;
