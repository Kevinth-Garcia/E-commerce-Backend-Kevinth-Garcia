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

app.use(cors());
app.use(express.json());

// Conectar DB (mejor llamar una vez)
await connectDB();

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

export default app;

// ✅ Solo escucha en local (NO en Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}
