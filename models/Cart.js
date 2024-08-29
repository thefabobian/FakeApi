const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },  // ID del carrito
  userId: { type: Number, required: true, ref: 'User' }, // ID del usuario relacionado
  date: { type: Date, required: true, default: Date.now }, // Fecha de creación
  products: [
    {
      productId: { type: Number, required: true, ref: 'Product' }, // ID del producto relacionado
      quantity: { type: Number, required: true }                   // Cantidad de productos
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;


