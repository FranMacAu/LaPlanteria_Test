//import e from 'express'
import express from 'express'
import { readFile, writeFile } from 'fs/promises'

import productRouter from './routes/productos.routes.js'
import userRouter from './routes/usuarios.routes.js'

const app = express()
const PORT = 3000;

// Middleware para que Express entienda JSON en el cuerpo de las peticiones
app.use(express.json())

// Inicio de servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

app.use('/usuarios', userRouter);
app.use('/productos', productRouter);


// Lectura de archivos JSON 
const productosData = await readFile('./productos.json', 'utf-8');
const productos = JSON.parse(productosData);

const categoriasData = await readFile('./categorias.json', 'utf-8');
const categorias = JSON.parse(categoriasData);

const usuariosData = await readFile('./usuarios.json', 'utf-8');
const usuarios = JSON.parse(usuariosData);

const ventasData = await readFile('./ventas.json', 'utf-8');
const ventas = JSON.parse(ventasData);

app.get('/', (req, res) => {
    res.send(`Servidor corriendo en el puerto ${PORT}`);
});