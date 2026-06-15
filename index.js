// imports
import express from 'express'
//import { readFile, writeFile } from 'fs/promises' // Ya no sería necesario tenerlo 
import cors from 'cors' 
import 'dotenv/config' // Carga las variables del archivo .env (actuamente no includio en .gitignore)
import { connectDB } from './config/db.js' // Importa la conexión a MongoDB

import productRouter from './routes/productos.routes.js'
import userRouter from './routes/usuarios.routes.js'
import categoriasRouter from './routes/categorias.routes.js'
import ventasRoutes from './routes/ventas.routes.js';

const app = express()
const PORT = process.env.PORT || 3000; // Toma el puerto del .env

// Conexión a la base de datos antes de configurar el servidor
await connectDB();

// (para que el front busque imágenes de los productos) convierte a la carpeta 'public' en un directorio estático accesible por URL
app.use('/public', express.static('public'));

// Middleware para que Express entienda JSON en el cuerpo de las peticiones
app.use(express.json())

// Inicio de servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

// habilitar pedidos de otros orígenes 
const origenesPermitidos = [
    'http://127.0.0.1:5500',          // Live Server local
    'https://appweb-two.vercel.app'   // La URL de Vercel 
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitimos peticiones sin origen (como Postman) o las que estén en la lista de origenesPermitidos
        if (!origin || origenesPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por políticas de CORS'));
        }
    }
}));

// rutas
app.use('/usuarios', userRouter);
app.use('/productos', productRouter);
app.use('/categorias', categoriasRouter);
app.use('/ventas', ventasRoutes);

// Lectura de archivos JSON 
// Se eliminó el bloque de readFile porque ya no se va a utilizar.

app.get('/', (req, res) => {
    res.send(`Servidor corriendo en el puerto ${PORT}`);
});