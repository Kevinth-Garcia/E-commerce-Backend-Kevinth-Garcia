import mongoose from "mongoose";

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
                    ref: "Product",
                    require: true,
                },
                cantidad: {
                    type: Number,
                    require: true,
                    min: 1,
                },
                precio: {
                    type: Number,
                    require: true,
                },
            },
        ],
        total: {
            type: Number,
            require: true,
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
        metodoPago: {
            type: String,
            default: "tarjeta",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);