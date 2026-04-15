
import '../../config/config.js';  
import mongoose from "mongoose";

const url=global.gConfig.dbURL
const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;