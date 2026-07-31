import { Router } from "express";
import Venta from '../models/Venta.js';
import { verificarToken } from '../middlewares/auth.middleware.js'; // Importamos el verificadorde token

const router = Router();

// verificamos token en el medio. Si no hay token, la función async nunca se ejecuta.
router.post('/', verificarToken, async (req, res) => {
    // Extraemos el email directamente del token (req.user), es más seguro que tomar el que se envía en el body
    const { productos } = req.body;
    const usuarioEmail = req.user.email; 

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: "Carrito vacío." });
    }

    try {
        let totalOrden = 0;
        const productosProcesados = productos.map(item => {
            totalOrden += item.precio * item.cantidad;
            return {
                id_producto: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            };
        });

        // Guardamos en MongoDB
        const nuevaVenta = await Venta.create({
            id: Date.now(),
            usuario_email: usuarioEmail,
            fecha: new Date().toISOString().split('T')[0],
            total: totalOrden,
            direccion: "Retiro en sucursal / A convenir",
            envioADomicilio: false,
            productos: productosProcesados
        });

        return res.status(201).json({
            message: "Orden de compra generada con éxito.",
            id_orden: nuevaVenta.id
        });

    } catch (error) {
        console.error("Error al procesar compra:", error);
        return res.status(500).json({ error: "Error interno al procesar la compra." });
    }
});

// Obtener todas las ventas (solo para pruebas)
router.get('/', async (req, res) => {
    try {
        // Buscamos todas las ventas registradas en la colección
        const ventas = await Venta.find({});
        
        // Si no hay ventas, podemos devolver un array vacío tranquilamente
        return res.status(200).json(ventas);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return res.status(500).json({ error: "Error interno al obtener el historial de ventas." });
    }
});

export default router;