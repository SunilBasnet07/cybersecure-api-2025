import mongoose from "mongoose"


async function connectDB() {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        await mongoose.connect(mongoUrl);
        console.log("mongoDb connected....")
    } catch (error) {
      console.log(error.message)
    }
}

export default connectDB;

