import mongoose from "mongoose";
//constante que se conectara a mongoDB de manera asyncrona utilizando el URI //
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Correctly");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
