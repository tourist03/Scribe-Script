const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create a user using : POST "/api/auth" , Dosen't require authentication

router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 4 }),
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password must be atlease 5 char").isLength({ min: 5 }),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        res.json({ error: "Please enter Unique Value for email" , message : err.message });
      });
  }
);

module.exports = router;
