const connectToMongo = require("./db");
const express = require("express");
connectToMongo();

const app = express();
const port = 3000;

//if we want to use the req.body then have to use the middleware -> express.json(), and to use middleware we use the "app.use" , now can deal with the json, can make request in json by sending content-type application/json

app.use(express.json());


//Available Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
