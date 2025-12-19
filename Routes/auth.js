import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "../Services/emailService.js";
import crypto from "crypto"; // modulo que me provee funcionalidad cryptografica para mayor seguridad
import { v4 as uuidv4 } from "uuid"; // modulo para mejorar la seguridad  haciendo mas dificil la predicibilidad de keys

//creamos la conexion con la api

const router = express.Router();

// constante de validacion de registro de usuario

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),
];

//constante para validacion de login de usuario

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

// endpoint donde se recibira el registro del usuario, haciendo validacion si existe o no existe el usuario

router.post("/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    const { email, password, nombre, apellido } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    const user = new User({
      email,
      password,
      nombre,
      apellido,
      isEmailVerified: false,
    });

    const verificationToken = uuidv4();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires =
      Date.now() +
      (Number(process.env.OTP_EXPIRATION_MINUTES) || 15) * 60 * 1000;

    await user.save();

    const backendUrl =
      process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const verifyUrl = `${backendUrl}/api/auth/verify-email/${verificationToken}`;

    try {
      await sendEmailVerification(user, verifyUrl);
    } catch (emailError) {
      console.error("Error enviando email de verificación:", emailError);

      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message:
          "Error al enviar email de verificación. Por favor intenta de nuevo.",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registro exitoso. Por favor verifica tu email para activar tu cuenta.",
      data: {
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
});

// endpoint donde se recibira el login del usuario, revisando si las credenciales del usuarios son las correctas cuando se registro

router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
        emailNotVerified: true,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          id: user._id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          isAdmin: user.isAdmin || false,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
});

// endpoint donde se observara el perfil del usuario, donde se observara si es Usuario o Admin

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
    }

    const jwt = await import("jsonwebtoken");

    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          isAdmin: user.isAdmin || false,
        },
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }
});

// endpoint para la recuperacion de contraseña

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe un usuario con ese email",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user, resetUrl);
      res.json({
        success: true,
        message: "Email de recuperación enviado",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({
        success: false,
        message: "Error al enviar el email",
      });
    }
  } catch (error) {
    console.error("Error en forgot-password:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
});

//peticion para verificacion de email con token

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientUrl}/verify-email?status=invalid`);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error("Error enviando email de bienvenida:", emailError);
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(
      `${clientUrl}/verify-email?status=success&email=${encodeURIComponent(
        user.email
      )}`
    );
  } catch (error) {
    console.error("Error en verify-email:", error);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/verify-email?status=error`);
  }
});

// endpoint para actualizar la contraseña nueva del usuario con verificacion

router.post("/reset-password/:token", async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Contraseña restablecida exitosamente",
    });
  } catch (error) {
    console.error("Error en reset-password:", error);
    res.status(500).json({
      success: false,
      message: "Error al restablecer la contraseña",
      error: error.message,
    });
  }
});

export default router;
