import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

import authRoutes from "./Routes/auth.js";
import productRoutes from "./Routes/products.js";
import orderRoutes from "./Routes/orders.js";
import userRoutes from "./Routes/users.js";

dotenv.config();

const app = express();

//Conectar DB (mejor llamar una vez)
connectDB();

app.use(cors());
app.use(express.json());


// Health
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/productRoutes", productRoutes);
app.use("/api/orderRoutes", orderRoutes);
app.use("/api/userRoutes", userRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});



app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Definir el puerto del servidor
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
  console.log(` Ambiente: ${process.env.NODE_ENV || "development"}`);
});

