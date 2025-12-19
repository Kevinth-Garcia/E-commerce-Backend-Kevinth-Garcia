import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../Models/User";

//constante para ver los usuarios
//mostrando los que estan verificados
//mostrando los no verificados

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB\n");
    const allUsers = await User.find({}).select(
      "email isEmailVerified createdAt"
    );
    console.log("Total de usuarios: ${allUsers.length}\n");
    const verified = allUsers.filter((u) => u.isEmailVerified);
    const unverified = allUsers.filter((u) => !u.isEmailVerified);
    console.log("Verificados: ${verified.lenght}");
    console.log("No verificados: ${unverified.lenght}\n");

    if (unverified.length > 0) {
      console.log("Usuarios no verificados");
      unverified.forEach((user) => {
        console.log("- ${user.email} (creado: ${user.createdAt})");
      });
    }
    console.log("\n--- Listado completo de usuarios ---");
    allUsers.forEach((user) => {
      const status = user.isEmailVerified ? "si" : "no";
      console.log(
        `${status} ${user.email} (Verificado: ${user.isEmailVerified})`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUsers();
