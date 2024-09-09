require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const app = express();

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion réussie à MongoDB'))
  .catch(error => console.error('Erreur de connexion à MongoDB :', error));

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil !');
});

// Exemple de route pour /api/books
app.use('/api/books', (req, res, next) => {
  const books = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(books);
});

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée !' });
});

// Exportation de l'application Express
module.exports = app;