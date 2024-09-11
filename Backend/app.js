require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const parsingMiddleware = require('./middleware/parsing');  // Importer le middleware de parsing JSON
const corsMiddleware = require('./middleware/cors');  // Importer le middleware CORS
const booksRoutes = require('./routes/books');  // Importer le fichier de routes des livres

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


// Utiliser les routes pour les livres, avec le chemin de base '/api/books'
app.use('/api/books', booksRoutes);



module.exports = app;