import { Router } from "express";
import { readFile } from 'fs/promises';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const categoriasData = await readFile('./data/categorias.json', 'utf-8');
        const categorias = JSON.parse(categoriasData);
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al leer categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;

