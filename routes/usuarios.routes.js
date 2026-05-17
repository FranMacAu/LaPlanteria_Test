import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'

//Lectura del JSON
const usuariosData = await readFile('./usuarios.json', 'utf-8');
const usuarios = JSON.parse(usuariosData);

const router = Router();

// LOGIN
// POST /usuarios/login - Validación de credenciales
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos." });
    }

    try {
        const usuariosRaw = await readFile('./usuarios.json', 'utf-8');
        const usuarios = JSON.parse(usuariosRaw);

        // buscar user y pass
        const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

        if (!usuarioValido) {
            return res.status(401).json({ error: "El email o la contraseña son incorrectos." });
        }
        
        return res.status(200).json({
            message: "Login exitoso.",
            usuario: {
                id: usuarioValido.id,
                email: usuarioValido.email
            }
        });

    } catch (error) {
        console.error("Error en el login del servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al procesar el login." });
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

// POST /usuarios - Registrar un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const usuariosRaw = await readFile('./usuarios.json', 'utf-8');
        const usuarios = JSON.parse(usuariosRaw);

        // Evitar correos duplicados
        const usuarioExiste = usuarios.some(u => u.email === email);
        if (usuarioExiste) {
            return res.status(409).json({ error: "El correo ya se encuentra registrado." });
        }

        // Creamos el nuevo usuario con ID incremental
        const nuevoUsuario = {
            id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
            nombre,
            apellido,
            email,
            password,
            esSocio: false // Todos arrancan como no socios por defecto
        };

        usuarios.push(nuevoUsuario);
        await writeFile('./usuarios.json', JSON.stringify(usuarios, null, 2));

        return res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        console.error("Error al registrar usuario en el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al registrar." });
    }
});

export default router;