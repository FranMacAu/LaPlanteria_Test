import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const router = Router();

// LOGIN
// POST /usuarios/login - Validación de credenciales
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscamos al usuario en Mongo
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: "El email o la contraseña son incorrectos." });
        }

        // 2. Comparamos la contraseña plana con el hash de la base de datos
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: "El email o la contraseña son incorrectos." });
        }

        // 3. Generamos el JWT (Dura 2 horas)
        const token = jwt.sign(
            { id_usuario: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 4. Enviamos el token al Frontend
        return res.status(200).json({
            message: "Login exitoso.",
            token, // Acá viaja la credencial
            usuario
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

// POST /usuarios - Registrar un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(409).json({ error: "El correo ya se encuentra registrado." });
        }

        // Encriptamos la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creamos el usuario en MongoDB
        const nuevoUsuario = await Usuario.create({
            id: Date.now(), // Generamos un ID numérico rápido
            nombre,
            apellido,
            email,
            password: hashedPassword,
            esSocio: false
        });

        return res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        console.error("Error al registrar usuario en el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al registrar." });
    }
});

// SOLO PRUEBA:consultar todos los usuarios
// router.get('/', (req, res) => {
//     res.json(usuarios);
// });

// SOLO PRUEBA:Consultar un usuario por ID
// router.get('/:usuario', async (req, res) => {
//     const id = parseInt(req.params.usuario);
    
//     const result = usuarios.find(u => u.id === id);
//     if (result) {
//         res.status(200).json(result);
//     } else {
//         res.status(404).json({ message: 'Usuario no encontrado' });
//     }
// });

export default router;