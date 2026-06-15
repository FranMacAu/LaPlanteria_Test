import { Router } from "express";
import Producto from '../models/Producto.js'; 
import Venta from '../models/Venta.js'; 

const router = Router();

// Consultar todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Consultar un producto por ID numérico
router.get('/:producto', async (req, res) => {
    const idProducto = parseInt(req.params.producto);
    
    if (isNaN(idProducto)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    try {
        const producto = await Producto.findOne({ id: idProducto });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Consultar productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
    const categoriaBuscada = req.params.categoria;
    
    try {
        // Usamos una expresión regular ($regex) para ignorar mayúsculas y minúsculas ('i')
        const productosCategoria = await Producto.find({ 
            categoria: { $regex: new RegExp(`^${categoriaBuscada}$`, 'i') } 
        });
        
        res.status(200).json(productosCategoria);
    } catch (error) {
        console.error('Error al buscar por categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { id_categoria, nombre, desc, precio, imagen, stock, envio_gratis, porcentaje_descuento, destacado } = req.body;
    
    // Validar contar con datos mínimos
    if (!nombre || !precio || !id_categoria) {
        return res.status(400).json({ message: "Faltan datos obligatorios (nombre, precio o categoría)" });
    }
    
    try {
        // Buscar el ID más alto actual en MongoDB para autoincrementar
        const ultimoProducto = await Producto.findOne().sort({ id: -1 });
        const nuevoId = (ultimoProducto && ultimoProducto.id) ? ultimoProducto.id + 1 : 101;

        // Instanciar el nuevo producto con Mongoose
        const nuevoProducto = new Producto({
            id: nuevoId,
            id_categoria,
            nombre,
            desc: desc || "",
            precio,
            imagen: imagen || "/public/images/default.webp",
            stock: stock || 0,
            envio_gratis: envio_gratis || false,
            porcentaje_descuento: porcentaje_descuento || 0,
            destacado: destacado || false
        });

        // Guardar físicamente en la base de datos
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
        
    } catch (error) {
        console.error('Error al guardar el nuevo producto en MongoDB:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear producto' });
    }
});

// Modificar descuento de un producto
router.put('/cambiarDescuento', async (req, res) => {
    const id = parseInt(req.body.id);
    const descuentoNuevo = parseFloat(req.body.descuentoNuevo);

    if (isNaN(id) || isNaN(descuentoNuevo) || descuentoNuevo < 0 || descuentoNuevo > 100) {
        return res.status(400).json({ error: 'El ID y el descuento deben ser números válidos (entre 0 y 100).' });
    }

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },
            { porcentaje_descuento: descuentoNuevo },
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado en MongoDB' });
        }

        return res.status(200).json({ 
            message: 'Descuento del producto actualizado', 
            producto: productoActualizado 
        });
    } catch (error) {
        console.error('Error al actualizar el descuento:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar nombre de un producto
router.put('/cambiarNombre', async (req, res) => {
    const id = parseInt(req.body.id);
    const { nombreNuevo } = req.body;

    if (isNaN(id) || !nombreNuevo || nombreNuevo.trim() === '') {
        return res.status(400).json({ error: 'El ID debe ser válido y el nombre no puede estar vacío.' });
    }

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },
            { nombre: nombreNuevo },
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado en MongoDB' });
        }

        return res.status(200).json({ 
            message: 'Nombre del producto actualizado', 
            producto: productoActualizado 
        });
    } catch (error) {
        console.error('Error al actualizar el nombre:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/cambiarPrecio', async (req, res) => {
    const { id, nuevoPrecio } = req.body;

    // Validación rápida para que no pongan precios negativos o vacíos
    if (nuevoPrecio === undefined || nuevoPrecio < 0) {
        return res.status(400).json({ error: 'El precio debe ser un número válido mayor o igual a cero.' });
    }

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },              // Filtramos por tu ID numérico
            { precio: nuevoPrecio }, // Actualizamos el campo precio
            { new: true }            // Pedimos que nos devuelva el objeto ya modificado
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({ 
            message: 'Precio actualizado correctamente',
            producto: productoActualizado 
        });
        
    } catch (error) {
        console.error('Error al actualizar el precio:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar descripción de un producto
router.put('/cambiarDescripcion', async (req, res) => {
    const id = parseInt(req.body.id);
    const { descripcionNueva } = req.body;

    if (isNaN(id) || !descripcionNueva || descripcionNueva.trim() === '') {
        return res.status(400).json({ error: 'El ID debe ser válido y la descripción no puede estar vacía.' });
    }

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },
            { desc: descripcionNueva }, 
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado en MongoDB' });
        }

        return res.status(200).json({ 
            message: 'Descripción del producto actualizada', 
            producto: productoActualizado 
        });
    } catch (error) {
        console.error('Error al actualizar la descripción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar producto por id
router.delete('/:id', async (req, res) => {
    const idProducto = parseInt(req.params.id);

    if (isNaN(idProducto)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    try {
        const producto = await Producto.findOne({ id: idProducto });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productoVendido = await Venta.findOne({ "productos.id_producto": idProducto });

        if (productoVendido) {
            return res.status(409).json({
                message: "No se puede eliminar el producto porque figura en ventas realizadas."
            });
        } 

        await Producto.deleteOne({ id: idProducto });
        return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;