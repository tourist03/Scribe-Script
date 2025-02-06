const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://tourist03:vNRV6xcX9jxbRAWU@cluster0.o27lo.mongodb.net/ScribeSpace?retryWrites=true&w=majority&appName=Cluster0";
const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoURI);
    }
    catch (err){
        // Removed console.error("Error connecting to mongo:", err);
    }
}

module.exports = connectToMongo;
