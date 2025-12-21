import mongoose from "mongoose";

// Ordenes: guardamos snapshot del producto (id/nombre/precio/cantidad)
// así no dependes de populate ni de refs para el TP.

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ idempotencia: evita órdenes duplicadas si el request se reintenta
    clientOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    productos: [
      {
        id: {
          type: String,
          required: true,
        },
        nombre: {
          type: String,
          required: true,
          trim: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        precio: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    estado: {
      type: String,
      enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },

    direccionEnvio: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
