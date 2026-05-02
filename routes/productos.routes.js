import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'

//Lectura del JSON
const productosData = await readFile('./productos.json', 'utf-8');
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
    const id = req.body.id;
    const { precioNuevo } = req.body.nuevo_precio;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        const index = productos.findIndex(p => p.id === id);

        productos[index].precio = precioNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Precio del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el precio del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    producto.precio = precio;
    await writeFile('./productos.json', JSON.stringify(productos));

    res.status(200).json(producto);
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
        const index = productos.findIndex(p => p.id === id);

        productos[index].porcentaje_descuento = descuentoNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Descuento del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el descuento del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    producto.precio = precio;
    await writeFile('./productos.json', JSON.stringify(productos));

    res.status(200).json(producto);
});

// Modificar nombre de un producto
router.put('/cambiarNombre', async (req, res) => {
    const id = req.body.id;
    const { nombreNuevo } = req.body.nuevo_nombre;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        const index = productos.findIndex(p => p.id === id);

        productos[index].nombre = nombreNuevo;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Nombre del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el nombre del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    producto.precio = precio;
    await writeFile('./productos.json', JSON.stringify(productos));

    res.status(200).json(producto);
});

// Modificar descripción de un producto
router.put('/cambiarDescripcion', async (req, res) => {
    const id = req.body.id;
    const { descripcionNueva } = req.body.descripcionNueva;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        const index = productos.findIndex(p => p.id === id);

        productos[index].descripcion = descripcionNueva;
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Descripción del producto actualizada' });
    } catch (error) {
        console.error('Error al actualizar la descripción del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    producto.precio = precio;
    await writeFile('./productos.json', JSON.stringify(productos));

    res.status(200).json(producto);
});

// Modificar stock de un producto
router.put('/cambiarStock', async (req, res) => {
    const id = req.body.id;
    const { stockNuevo } = req.body.stockNuevo;

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try{
        const index = productos.findIndex(p => p.id === id);

        productos[index].stock = stockNuevo;
        if (stockNuevo < 0) {
            stockNuevo = 0;
        }
        await writeFile('./productos.json', JSON.stringify(productos, null, 2));
        return res.status(200).json({ message: 'Stock del producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    producto.precio = precio;
    await writeFile('./productos.json', JSON.stringify(productos));

    res.status(200).json(producto);
});

// Eliminar un producto (verificación con ventas)
router.delete('/:id', async (req, res) => {
    const idProducto = parseInt(req.params.id);

    const producto = productos.find(p => p.id === idProducto);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
    // Leemos las ventas
    const ventasData = await readFile('./ventas.json', 'utf-8');
    const ventas = JSON.parse(ventasData);

    // Bbuscamos si el ID del producto está en alguna venta
    const productoVendido = ventas.some(venta => 
        venta.productos.some(p => p.id_producto === idProducto)
    );

    if (productoVendido) {
        return res.status(409).json({    // HTTP 409 Conflict indica que una solicitud del cliente no pudo procesarse porque entra en conflicto con el estado actual del recurso en el servidor
            message: "No se puede eliminar el producto porque figura en ventas realizadas."
        });
    } else {
        const productosFiltrados = productos.filter(p => p.id !== idProducto); // archivo json completo sin el is del procucto a borrar
        productos = productosFiltrados; // se actualiza el array en la ram
        await writeFile('./productos.json', JSON.stringify(productosFiltrados, null, 2)); // se guarda el nuevo array (filtrado)
        return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        }
    }     
    catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
        }
});

export default router;