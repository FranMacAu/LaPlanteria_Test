import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    desc: { type: String },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imagen: { type: String },
    id_categoria: { type: Number, required: true }
});

export default mongoose.model('Producto', productoSchema);