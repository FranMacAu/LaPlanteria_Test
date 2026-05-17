import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();

// POST /ventas - Registrar una nueva orden de compra
router.post('/', async (req, res) => {
    const { usuarioEmail, productos } = req.body;

    // Validación básica
    if (!usuarioEmail || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Datos de orden incompletos o carrito vacío." });
    }

    try {
        // Leer las ventas existentes
        const ventasRaw = await readFile('./ventas.json', 'utf-8');
        const ventas = JSON.parse(ventasRaw);

        // Calcular el total real en el servidor para evitar fraudes
        let totalOrden = 0;
        const productosProcesados = productos.map(item => {
            const subtotal = item.precio * item.cantidad;
            totalOrden += subtotal;
            return {
                id_producto: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            };
        });

        // Crear el objeto de la nueva venta
        const nuevaVenta = {
            id: ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 501,
            usuario_email: usuarioEmail,
            fecha: new Date().toISOString().split('T')[0], // Guarda "YYYY-MM-DD"
            total: totalOrden,
            direccion: "Retiro en sucursal / A convenir", // por defecto (no implementado)
            envioADomicilio: false,
            productos: productosProcesados
        };

        // Persistencia
        ventas.push(nuevaVenta);
        await writeFile('./ventas.json', JSON.stringify(ventas, null, 2));

        return res.status(201).json({
            message: "Orden de compra generada con éxito.",
            id_orden: nuevaVenta.id
        });

    } catch (error) {
        console.error("Error al procesar la orden de compra:", error);
        return res.status(500).json({ error: "Error interno al procesar la compra." });
    }
});

export default router;