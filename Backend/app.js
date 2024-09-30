require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const path = require("path"); // Importer path
const cors = require('cors'); // Ajout de CORS directement
const app = express();

// Import routes
const booksRoutes = require('./routes/books'); 
const usersRoutes = require('./routes/users');

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion réussie à MongoDB'))
  .catch(error => console.error('Erreur de connexion à MongoDB :', error));

// Utiliser CORS directement
app.use(cors()); // Applique CORS sur toutes les routes

// Utiliser le middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour les données encodées en URL, si nécessaire

// Servir les fichiers statiques du dossier images
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve les fichiers du dossier images

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil !');
});

// Utiliser les routes pour les livres et les utilisateurs
app.use('/api/books', booksRoutes);
app.use('/api/auth', usersRoutes);

module.exports = app;