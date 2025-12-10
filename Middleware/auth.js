import jwt from "jsonwebtoken";
import User from "../Models/User";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["autorization"];
    const token = authHeader && authHeader.split("")[1];
    

    if (!token) {
        return res
            .status(401)
            .json({ message: "Acceso denegado. Token no proporcionado." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user)
            return res.status(401).json({ message: "Usuario no encontrado." });
        req.user = user;
    next();
    } catch (error) {
        
        return res.status(403).json({ message: "Token invalido o expirado." });
    }
    
   
};

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
