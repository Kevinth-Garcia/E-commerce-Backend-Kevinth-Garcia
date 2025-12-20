import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";

const router = express.Router();


//obtener los datos de los usuarios

router.get("/", authenticateToken, authAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

//actualizar usuario

router.put("/:id", authenticateToken, authAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

//para eliminar usuarios

router.delete("/:id", authenticateToken, authAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

export default router;
