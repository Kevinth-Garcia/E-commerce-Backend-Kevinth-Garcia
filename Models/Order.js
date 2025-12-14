import mongoose from "mongoose";

//schema de ordenes para crear
//aun no existe metodo de pago para hacer depues una implementacion con stripe por falta de tiempo

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //requiere nombre
      require: true,
    },

    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", //requiere producto
          require: true,
        },
        cantidad: {
          type: Number, //cantidad de productos
          require: true,
          min: 1,
        },
        precio: {
          type: Number, //precio marcado
          require: true,
        },
      },
    ],
    total: {
      type: Number, //total de productos
      require: true,
    },
    estado: {
      type: String, //el estado en el que se encuentra la orden
      enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    direccionEnvio: {
      calle: String, //dirreccion a donde debe llegar la orden
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
