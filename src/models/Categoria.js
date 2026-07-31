import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
});

export default mongoose.model('Categoria', categoriaSchema);