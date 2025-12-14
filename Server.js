import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

//Rutas importadas de routes

import authRoutes from "./Routes/auth.js";
import productRoutes from "./Routes/products.js";
import orderRoutes from "./Routes/orders.js";
import userRoutes from "./Routes/users.js";

dotenv.config();

//configuracion para poder conectar al servidor de express con la base de datos de mongoDB, tomando en cuenta las rutas para acceder con las rutas de api
//que avisa de errores en el middleware

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/productRoutes", productRoutes);
app.use("/api/orderRoutes", orderRoutes);
app.use("/api/userRoutes", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error de conexion con el servidor",
    ...(process.env.NODE_ENV === "develoment" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
