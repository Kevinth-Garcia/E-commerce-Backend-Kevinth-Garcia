import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
            required: true,
            minlength: [6, "La contraseña debe ser de al menos 6 caracteres"],
            select: false,
        },
        nombre: {
            type: String,
            required: [true, "El nombre es requerido"],
            trim: true,

        },
        apellido: {
            type: String,
            required: [true, "El apellido es requerido"],
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    
};

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
