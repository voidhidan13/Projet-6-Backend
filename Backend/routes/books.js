const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

// Route POST pour ajouter un livre
router.post('/', booksController.createBook);

// Route GET pour récupérer tous les livres
router.get('/', booksController.getAllBooks);

// Route GET pour récupérer un livre par son ID
router.get('/:id', booksController.getOneBook);

// Route PUT pour modifier un livre existant
router.put('/:id', booksController.updateBook);

// Route DELETE pour supprimer un livre
router.delete('/:id', booksController.deleteBook);

module.exports = router;