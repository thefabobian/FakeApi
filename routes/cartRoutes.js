const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Obtener todos los carros
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo carros', error: err });
  }
});

// Obtner un carrito por ID
router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//const cart = await Cart.findOne({ id: req.params.id });


// Crear un nuevo carro
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(400).json({ message: 'Error creando carro', error: err });
  }
});

// Actualizar un carro por ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCart) return res.status(404).json({ message: 'Carro no encontrado' });
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: 'Error actualizando carro', error: err });
  }
});

// Eliminar un carro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) return res.status(404).json({ message: 'Carro no encontrado' });
    res.json({ message: 'Carro eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando carro', error: err });
  }
});

module.exports = router;
