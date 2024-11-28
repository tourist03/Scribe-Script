const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/ScribeSpace";

const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to mongo successfully");
    }
    catch (err){
        console.error("Error connecting to mongo:", err);
    }
}

module.exports = connectToMongo;
