require('dotenv').config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const passport = require('./config/passport');
const session = require('express-session');
const drawingsRouter = require('./routes/drawings');

connectToMongo();

const app = express();
const port = 5001;

//if we want to use the req.body then have to use the middleware -> express.json(), and to use middleware we use the "app.use" , now can deal with the json, can make request in json by sending content-type application/json

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

//Available Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/drawings", drawingsRouter);
app.use('/api/auth', require('./routes/socialAuth'));

app.listen(port, () => {
  console.log(`ScribeSpace-Backend listening at http://localhost:${port}`);
});
