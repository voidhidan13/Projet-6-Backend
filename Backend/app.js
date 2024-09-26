require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");


// Import middleware
const parsingMiddleware = require('./middleware/parsing');  
const corsMiddleware = require('./middleware/cors');  

// Import routes
const booksRoutes = require('./routes/books'); 
const usersRoutes = require('./routes/users');

// Importer le fichier de routes des livres

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
app.use('/api/auth', usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;