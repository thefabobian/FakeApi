/* const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

// Necesario para manejar rutas de archivos en Node.js
const path = require('path');

// Importar rutas para metodos HTTP
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Importar los modelos necesarios
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');

// Inicializar la aplicación
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json()); 

// Configurar la carpeta public como carpeta estática para servir archivos
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/fakestore', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Usar las rutas definidas
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/carts', cartRoutes);

// Función para obtener y guardar datos
async function fetchAndSaveData(model, url) {
  try {
    const existingData = await model.find().limit(1);
    if (existingData.length > 0) {
      console.log(`Datos de ${model.modelName} ya existen en la base de datos. No se insertarán duplicados.`);
      return;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Usar `insertMany` si no existen datos en la colección
    await model.insertMany(data);
    console.log(`${model.modelName}s guardados en la base de datos`);
  } catch (err) {
    console.error(`Error obteniendo o guardando ${model.modelName}s:`, err);
  }
}

// Llamar a la función para productos, usuarios y carros
fetchAndSaveData(Product, 'https://fakestoreapi.com/products');
fetchAndSaveData(User, 'https://fakestoreapi.com/users');
fetchAndSaveData(Cart, 'https://fakestoreapi.com/carts');

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */

//////////////

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

// Necesario para manejar rutas de archivos en Node.js
const path = require('path');

// Importar rutas para métodos HTTP
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Importar los modelos necesarios
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');

// Inicializar la aplicación
const app = express();

// Middleware para parsear JSON
app.use(express.json()); 

// Configurar la carpeta public como carpeta estática para servir archivos
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/fakestore', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Usar las rutas definidas
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/carts', cartRoutes);

// Función para obtener y guardar datos
async function fetchAndSaveData(model, url) {
  try {
    const existingData = await model.find().limit(1);
    if (existingData.length > 0) {
      console.log(`Datos de ${model.modelName} ya existen en la base de datos. No se insertarán duplicados.`);
      return;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Usar `insertMany` si no existen datos en la colección
    await model.insertMany(data);
    console.log(`${model.modelName}s guardados en la base de datos`);
  } catch (err) {
    console.error(`Error obteniendo o guardando ${model.modelName}s:`, err);
  }
}

// Llamar a la función para productos, usuarios y carros
fetchAndSaveData(Product, 'https://fakestoreapi.com/products');
fetchAndSaveData(User, 'https://fakestoreapi.com/users');
fetchAndSaveData(Cart, 'https://fakestoreapi.com/carts');

// Exportar la aplicación para pruebas
module.exports = app;

// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
