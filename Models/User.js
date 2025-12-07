import mongoose from "mongoose";
import bcrypt from "bycryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Por favor ingrese un email válido",
            ],
        },
        password: {
            type: String,
            require: true,
            minlenght: [6, "La contraseña debe ser de al menos 6 caracteres"],
            select: false,
        },
        nombre: {
            type: String,
            require: [true, "El nombre es requerido"],
            trim: true,

        },
        apellido: {
            type: String,
            require: [true, "El apellido es requerido"],
            trim: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        emailVerificationExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,

    },
    {
        timestamps: true,
    }
);


