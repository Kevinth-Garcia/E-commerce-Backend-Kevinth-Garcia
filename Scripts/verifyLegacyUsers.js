import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../Models/User.js";

dotenv.config({ path: "./.env" });

//const para verificar a los usuarios antiguos

const verifyAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB\n");

    const allUsers = await User.find({});
    console.log(`Total de usuarios en la base de datos: ${allUsers.length}\n`);
    const unverifiedUsers = allUsers.filter((u) => !u.isEmailVerified);

    console.log(`Usuarios sin verificar: ${unverifiedUsers.length}`);
    console.log(
      `Usuarios ya verificados: ${allUsers.length - unverifiedUsers.length}\n`
    );

    if (unverifiedUsers.length === 0) {
      console.log("Todos los usuarios ya están verificados.");
      process.exit(0);
    }

    console.log("Verificando usuarios...\n");

    let successCount = 0;
    for (const user of unverifiedUsers) {
      try {
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        successCount++;
        console.log(`  ${user.email} - Verificado`);
      } catch (error) {
        console.log(`  ${user.email} - Error: ${error.message}`);
      }
    }

    console.log(`\n Proceso completado!`);
    console.log(
      `   ${successCount} de ${unverifiedUsers.length} usuarios actualizados exitosamente.`
    );
    console.log(`   Todos los usuarios ahora pueden iniciar sesión.\n`);

    process.exit(0);
  } catch (error) {
    console.error("Error al verificar usuarios:", error);
    process.exit(1);
  }
};

verifyAllUsers();
