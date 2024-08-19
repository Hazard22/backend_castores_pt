import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export function verifyToken(req, res, next) {

    
    
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "No se encontró token" });
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET);
        req.username = payload.username;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token no válido" });
    }
}