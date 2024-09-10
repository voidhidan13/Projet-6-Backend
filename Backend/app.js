require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Books = require('./models/books');
const parsingMiddleware = require('./middleware/parsing');  // Importer le middleware de parsing JSON
const corsMiddleware = require('./middleware/cors');  // Importer le middleware CORS

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion réussie à MongoDB'))
  .catch(error => console.error('Erreur de connexion à MongoDB :', error));

// Utiliser les middlewares
app.use(parsingMiddleware);  
app.use(corsMiddleware);  

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
  books.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré' }))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer tous les livres
app.get('/api/books', (req, res, next) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;