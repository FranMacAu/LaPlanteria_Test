import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'

//Lectura del JSON
const usuariosData = await readFile('./usuarios.json', 'utf-8');
const usuarios = JSON.parse(usuariosData);

const router = Router();

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Faltan datos obligatorios (email o password)" });
    }

    const user = usuarios.find(u => u.email === email && u.password === password);
    if (user) {
        res.status(200).json({ message: "Login exitoso", user });
    } else {
        res.status(401).json({ message: "Credenciales inválidas" });
    }
});

// consultar todos los usuarios
router.get('/', (req, res) => {
    res.json(usuarios);
});

// Consultar un usuario por ID
router.get('/:usuario', async (req, res) => {
    const id = parseInt(req.params.usuario);
    
    const result = usuarios.find(u => u.id === id);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

export default router;