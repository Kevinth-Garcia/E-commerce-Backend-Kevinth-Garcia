import mongoose from "mongoose";

//Esquema de producto que representa si un articulo esta disponible en la tienda
// con sus correspectivos campos de Nombre, Descripcion, Precio, Imagen , Stock.

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true, //requiere nombre
      trim: true,
    },

    description: {
      type: String,
      require: true, //requiere descripcion
    },

    precio: {
      type: Number,
      require: true, //requiere un precio
      min: 0, //que este no sea negativo
    },
    imagen: {
      type: String,
      require: true, //requiere URL de la imagen
    },
    stock: {
      type: Number,
      default: 0, // disponibilidad 0 por defecto
    },
  },
  {
    timestamps: true, //Timestamps automaticos
  }
);

export default mongoose.model("Product", productSchema);
