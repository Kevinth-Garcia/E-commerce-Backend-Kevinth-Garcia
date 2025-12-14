import express from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

const productValidation = [
  body("nombre").trim().notEmpty().withMessage("El nombre es requerido"),
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es requerida"),
  body("precio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("imagen").trim().notEmpty().withMessage("La imagen es requerida"),
];


router.get("/", async (req, res) => {
  try {
    
    const products = await Product.find().sort({ createdAt: -1 });

    
    const formattedProducts = products.map((product) => ({
      id: product._id.toString(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
    }));
    
    res.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    
    const product = await Product.findById(req.params.id);

    // Si no existe, retornar error 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    
    const formattedProduct = {
      id: product._id.toString(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
    };

    
    res.json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
      error: error.message,
    });
  }
});


router.post(
  "/",
  authenticateToken,
  authAdmin,
  productValidation,
  async (req, res) => {
    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errors.array(),
        });
      }

     
      const { nombre, descripcion, precio, imagen } = req.body;

      
      const product = new Product({
        nombre,
        descripcion,
        precio,
        imagen,
      });

      
      await product.save();

      
      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear producto",
        error: error.message,
      });
    }
  }
);


router.put(
  "/:id",
  authenticateToken,
  authAdmin,
  productValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errors.array(),
        });
      }

      const { nombre, descripcion, precio, imagen } = req.body;

      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      product.nombre = nombre;
      product.descripcion = descripcion;
      product.precio = precio;
      product.imagen = imagen;

      await product.save();

      res.json({
        success: true,
        message: "Producto actualizado exitosamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar producto",
        error: error.message,
      });
    }
  }
);


router.delete("/:id", authenticateToken, authAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
});

export default router;
