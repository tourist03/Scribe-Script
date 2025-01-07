const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const drawingsRouter = require('./routes/drawings');

connectToMongo();

const app = express();
const port = 5001;

//if we want to use the req.body then have to use the middleware -> express.json(), and to use middleware we use the "app.use" , now can deal with the json, can make request in json by sending content-type application/json

app.use(cors());
app.use(express.json());

//Available Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/drawings", drawingsRouter);

app.listen(port, () => {
  console.log(`ScribeSpace-Backend listening at http://localhost:${port}`);
});
