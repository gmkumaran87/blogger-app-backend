// import { MongoClient } from "mongodb";
const mongoose = require("mongoose");

/*const dbConnection = async() => {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log("Connected to the DB...!");
        return client;
    } catch (error) {
        console.log(error);
    }
};*/

const connectDB = () => {
    return mongoose
        .connect(process.env.MONGO_URI)
        .then((data) => console.log("Connected to DB"))
        .catch((err) => console.log(err));
};

module.exports = connectDB;