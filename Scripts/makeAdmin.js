import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "./.env" });

const makeAdmin = async () => {
  try {
    
    const email = process.argv[2];

    if (!email) {
      console.log("Error: Debes proporcionar un email como parámetro.");
      console.log("Uso: node makeAdmin.js <email>");
      console.log("Ejemplo: node makeAdmin.js usuario@example.com");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Usuario con email ${email} no encontrado.`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Usuario ${email} declarado ADMIN.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

makeAdmin();
