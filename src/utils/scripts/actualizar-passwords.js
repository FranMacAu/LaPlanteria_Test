import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDB } from '../../config/db.js';
import Usuario from '../../models/Usuario.js';

const actualizarContrasenas = async () => {
    try {
        await connectDB();
        
        // Traemos a todos los usuarios de MongoDB
        const usuarios = await Usuario.find();
        let contador = 0;

        for (let usuario of usuarios) {
            // Verificamos si la contraseña ya está encriptada 
            if (!usuario.password.startsWith('$2')) {
                // Generamos la "sal" y encriptamos
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
                
                await usuario.save(); // Guardamos el usuario actualizado
                contador++;
            }
        }

        console.log(`Se encriptaron las contraseñas de ${contador} usuarios`);
        process.exit(0);
    } catch (error) {
        console.error("Error encriptando contraseñas:", error);
        process.exit(1);
    }
};

actualizarContrasenas();