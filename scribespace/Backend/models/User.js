const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github', 'microsoft'],
    default: 'local'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
