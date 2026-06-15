import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'

//Lectura del JSON
const productosData = await readFile('./data/productos.json', 'utf-8');
let productos = JSON.parse(productosData);

const router = Router();

// consultar todosls productos
router.get('/', (req, res) => {
    res.json(productos);
});

// Consultar un producto por ID
router.get('/:producto', async (req, res) => {
    const id = parseInt(req.params.producto);
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
});

// Consultar productos por categoria
router.get('/categoria/:categoria', async (req, res) => {
    const categoria = req.params.categoria.toLowerCase();
    const productosCategoria = productos.filter(p => p.categoria.toLowerCase() === categoria);
    res.status(200).json(productosCategoria);
});

// Crear producto
router.post('/', async (req, res) => {
    const { id_categoria, nombre, desc, precio, imagen, stock, envio_gratis, porcentaje_descuento, destacado } = req.body;
    //validar contar con datos mínimos
    if (!nombre || !precio || !id_categoria) {
        return res.status(400).json({ message: "Faltan datos obligatorios (nombre, precio o categoría)" });
    }
    
    // crear producto (algunos campos no son obligatorios por lo que tienen default)
   const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 101, // Empezamos en 101 como tus otros IDs
        id_categoria,
        nombre,
        desc: desc || 0,
        precio,
        imagen: imagen || "/public/images/default.webp", // Imagen por defecto si no mandan una
        stock: stock || 0,
        envio_gratis: envio_gratis || false,
        porcentaje_descuento: porcentaje_descuento || 0,
        destacado: destacado || false
    };
    // se guarda en la ram
    productos.push(nuevoProducto);
    // se sobreescribe el archivo json(controlando excepciones)
    try {
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));   // formatea el json para que quede legible
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al guardar el nuevo producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Modificar precio de un producto
router.put('/cambiarPrecio', async (req, res) => {
    const { id, precioNuevo } = req.body;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        producto.precio = precioNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Precio del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el precio del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar descuento de un producto
router.put('/cambiarDescuento', async (req, res) => {
    const id = req.body.id;
    const { descuentoNuevo } = req.body.nuevoDescuento;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        producto.porcentaje_descuento = descuentoNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Descuento del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el descuento del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar nombre de un producto
router.put('/cambiarNombre', async (req, res) => {
    const { id, nombreNuevo } = req.body;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        producto.nombre = nombreNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Nombre del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el nombre del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar descripción de un producto
router.put('/cambiarDescripcion', async (req, res) => {
    const { id, descripcionNueva } = req.body;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        productodescripcion = descripcionNueva;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Descripción del producto actualizada' });
    } catch (error) {
        console.error('Error al actualizar la descripción del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar stock de un producto
router.put('/cambiarStock', async (req, res) => {
    const { id, stockNuevo } = req.body;

    // Corregimos el bug lógico: validamos antes de asignar
    let stockFinal = stockNuevo < 0 ? 0 : stockNuevo;

    try {
        // findOneAndUpdate busca y actualiza en un solo paso
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },              // Filtro de búsqueda
            { stock: stockFinal },   // Qué campo actualizar
            { new: true }            // Devuelve el objeto ya modificado
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({ 
            message: 'Stock del producto actualizado',
            producto: productoActualizado 
        });
        
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Modificar precio de un producto
router.put('/cambiarPrecio', async (req, res) => {
    const { id, nuevoPrecio } = req.body;

    // Validación rápida para que no pongan precios negativos o vacíos
    if (nuevoPrecio === undefined || nuevoPrecio < 0) {
        return res.status(400).json({ error: 'El precio debe ser un número válido mayor o igual a cero.' });
    }

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { id: id },              // Filtramos por ID
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

// Eliminar un producto (verificación con ventas)
router.delete('/:id', async (req, res) => {
    const idProducto = parseInt(req.params.id);

    try {
        // 1. Verificamos si el producto existe en MongoDB
        const producto = await Producto.findOne({ id: idProducto });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // 2. Buscamos directamente en Mongo si alguna venta tiene este id_producto
        // Mongoose permite buscar dentro de arrays de objetos fácilmente
        const productoVendido = await Venta.findOne({ "productos.id_producto": idProducto });

        if (productoVendido) {
            return res.status(409).json({
                message: "No se puede eliminar el producto porque figura en ventas realizadas."
            });
        } 

        // 3. Si no hay ventas, lo eliminamos de la base de datos
        await Producto.deleteOne({ id: idProducto });
        return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;