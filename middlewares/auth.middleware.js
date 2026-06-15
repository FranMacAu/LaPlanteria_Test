import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Buscamos el token en la cabecera 'Authorization'
    const authHeader = req.headers['authorization'];
    
    // El formato estándar es "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        //  Verificamos que el token sea auténtico y no haya expirado
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Si es válido, inyectamos los datos del usuario en la request
        req.user = decoded; 
        
        // Le damos permiso para continuar hacia la ruta
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};