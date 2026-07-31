import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    usuario_email: { type: String, required: true },
    fecha: { type: String },
    total: { type: Number, required: true },
    direccion: { type: String },
    envioADomicilio: { type: Boolean },
    productos: [{
        id_producto: Number,
        cantidad: Number,
        precio_unitario: Number
    }]
}, { timestamps: true });

export default mongoose.model('Venta', ventaSchema);