import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    esSocio: { type: Boolean, default: false }
}, { 
    timestamps: true 
});

// Método para que cuando enviemos el usuario al Frontend no viaje la contraseña
usuarioSchema.methods.toJSON = function() {
    const usuario = this.toObject();
    delete usuario.password;
    return usuario;
};

export default mongoose.model('Usuario', usuarioSchema);