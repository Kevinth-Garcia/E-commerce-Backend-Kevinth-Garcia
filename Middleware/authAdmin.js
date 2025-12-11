
import User from "../Models/User.js";

export const authAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Usuario no autenticado.",
            });
        }
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. Se requieren permisos de Administrador"
            });
        }
    } catch (error) {
        console.error("Error en middleware admin:", error);
        res.status(500).json({
            success: false,
            message: "Error al verificar permisos de administrador",
        });
    }
    
};