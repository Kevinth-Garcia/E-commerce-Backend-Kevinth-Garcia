import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//schema de usuario para mongoose

const userSchema = new mongoose.Schema(
  {
    email: {
      //requiere email para registrar usuario
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
      //requiere contraseña para registrar usuario
      type: String,
      required: true,
      minlength: [6, "La contraseña debe ser de al menos 6 caracteres"],
      select: false,
    },
    nombre: {
      type: String, //requiere nombre para registrar usuario
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    apellido: {
      type: String, //requiere apellido para registrar usuario
      required: [true, "El apellido es requerido"],
      trim: true,
    },
    isAdmin: {
      // usuario admin desactivado por defecto
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      //verificacion de correo desactivado por defecto el usuario debe hacerlo manualmente
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

//schema para guardar los datos del usuario en la base de datos con encryptado

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
