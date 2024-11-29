const jwt = require("jsonwebtoken");
const JWT_SECRET = "$cr!be$p@ceJ%T$*cr&t";

const fetchUser = (req, res, next) => {
  //Get the user from the JWT Token and add id to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please Authenticate with valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate with valid token" });
  }
};

module.exports = fetchUser;
