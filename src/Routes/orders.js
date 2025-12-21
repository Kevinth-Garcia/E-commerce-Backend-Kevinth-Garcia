import express from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import { authenticateToken } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { sendOrderConfirmationEmail } from "../Services/emailService.js";

const router = express.Router();

// Validación
const orderValidation = [
  body("productos")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un producto"),

  body("productos.*.id")
    .notEmpty()
    .withMessage("El ID del producto es requerido"),

  body("productos.*.nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es requerido"),

  body("productos.*.precio")
    .custom((value) => {
      const num = Number(value);
      return !isNaN(num) && num >= 0;
    })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("productos.*.cantidad")
    .custom((value) => {
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num) && num >= 1;
    })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("total")
    .custom((value) => {
      const num = Number(value);
      return !isNaN(num) && num >= 0;
    })
    .withMessage("El total debe ser un número mayor o igual a 0"),

  // 
  body("clientOrderId")
    .optional()
    .isString()
    .isLength({ min: 8 })
    .withMessage("clientOrderId inválido"),
];

// ADMIN: ver todas
router.get("/admin/all", authenticateToken, authAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("usuario", "email nombre apellido");

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todas las órdenes",
      error: error.message,
    });
  }
});

// ✅ CREAR ORDEN
router.post("/", authenticateToken, orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    const { productos, total, clientOrderId } = req.body;

    // idempotencia: si ya existe una orden con ese clientOrderId, devuelve esa
    if (clientOrderId) {
      const existing = await Order.findOne({
        usuario: req.user._id,
        clientOrderId,
      }).populate("usuario", "email nombre apellido");

      if (existing) {
        return res.status(200).json({
          success: true,
          message: "Orden ya registrada ✅",
          data: existing,
        });
      }
    }

    //  crear orden 
    const order = new Order({
      usuario: req.user._id,
      productos,
      total,
      ...(clientOrderId ? { clientOrderId } : {}),
    });

    await order.save();
    await order.populate("usuario", "email nombre apellido");

    // (evita timeouts en Render)
    // si falla, lo loguea, pero la compra se mantiene
    (async () => {
      try {
        const emailOrder = {
          _id: order._id,
          total: order.total,
          items: productos.map((p) => ({
            title: p.nombre,
            quantity: p.cantidad,
            unit_price: p.precio,
          })),
        };

        await sendOrderConfirmationEmail(order.usuario, emailOrder);
      } catch (emailError) {
        console.error("Error enviando email de confirmación:", emailError);
      }
    })();

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      data: order,
    });
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear orden",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno del servidor",
    });
  }
});

// Mis órdenes
router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user._id })
      .sort({ createdAt: -1 })
      .populate("usuario", "email nombre apellido");

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener órdenes",
      error: error.message,
    });
  }
});

// Orden por ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      usuario: req.user._id,
    }).populate("usuario", "email nombre apellido");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener orden",
      error: error.message,
    });
  }
});

// ADMIN: eliminar orden
router.delete("/:id", authenticateToken, authAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });
    }

    await order.deleteOne();

    res.json({ success: true, message: "Orden eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar orden",
      error: error.message,
    });
  }
});

export default router;
