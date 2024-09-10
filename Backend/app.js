require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Books = require('./models/books');

// Middleware pour parser le JSON
app.use(express.json());

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

// Route POST pour ajouter un livre
app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const books = new Books({
    ...req.body
  });
  books.save()  // Sauvegarde du livre
    .then(() => res.status(201).json({ message: 'Objet enregistré' }))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer tous les livres
app.get('/api/books', (req, res, next) => {
  Books.find()  // Recherche de tous les livres
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;