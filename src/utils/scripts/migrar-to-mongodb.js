import 'dotenv/config';
import { readFile } from 'fs/promises';
import { connectDB } from '../../config/db.js';

import Usuario from '../../models/Usuario.js';
import Producto from '../../models/Producto.js';
import Categoria from '../../models/Categoria.js';
import Venta from '../../models/Venta.js';

const migrarDatos = async () => {
    try {
        await connectDB(); // Conectamos a MongoDB

        // Leemos los archivos JSON locales
        const usuariosJSON = JSON.parse(await readFile('./data/usuarios.json', 'utf-8'));
        const productosJSON = JSON.parse(await readFile('./data/productos.json', 'utf-8'));
        const categoriasJSON = JSON.parse(await readFile('./data/categorias.json', 'utf-8'));
        const ventasJSON = JSON.parse(await readFile('./data/ventas.json', 'utf-8'));

        // Limpiamos la base de datos por si ya tenía algo (evita duplicados)
        await Usuario.deleteMany();
        await Producto.deleteMany();
        await Categoria.deleteMany();
        await Venta.deleteMany();

        // Insertamos todo 
        await Usuario.insertMany(usuariosJSON);
        await Producto.insertMany(productosJSON);
        await Categoria.insertMany(categoriasJSON);
        await Venta.insertMany(ventasJSON);

        console.log("Migración completada con éxito! Todos los datos están en MongoDB");
        process.exit(0); // Cerramos el script
    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
};

migrarDatos();