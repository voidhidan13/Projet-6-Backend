const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const auth = require('../middleware/auth');


// Route POST pour ajouter un livre
router.post('/', auth , booksController.createBook);

// Route POST pour noter un livre 
router.post('/:id/rating',auth, booksController.rateBooks);

// Route GET pour récupérer tous les livres
router.get('/', booksController.getAllBooks);

// Route GET pour récupérer un livre par son ID
router.get('/:id', booksController.getOneBook);

//Route Get pour récupérer les trois meilleurs livres 
router.get('/bestrating', booksController.getBestRatedBooks);

// Route PUT pour modifier un livre existant
router.put('/:id',auth, booksController.updateBook);

// Route DELETE pour supprimer un livre
router.delete('/:id',auth, booksController.deleteBook);

module.exports = router;