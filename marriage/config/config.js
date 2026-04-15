import dotenv from "dotenv";
dotenv.config();

global.gConfig = {
    dbURL: process.env.MONGO_URI
}

