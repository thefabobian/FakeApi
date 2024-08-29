const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo productos', error: err });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//const product = await Product.findOne({ id: req.params.id });


// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error creando producto', error: err });
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    // Verificar si los datos son válidos
    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: 'Datos inválidos para actualizar el producto' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error actualizando producto', error: err });
  }
});


// Actualizar un producto por ID
/* router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error actualizando producto', error: err });
  }
}); */

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });

    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando producto', error: err });
  }
});

module.exports = router;
