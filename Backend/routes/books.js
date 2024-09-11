const express = require('express');
const router = express.Router();
const Books = require('../models/books');  

// Route POST pour ajouter un livre
router.post('/', (req, res, next) => {
  delete req.body._id;
  const books = new Books({
    ...req.body
  });
  books.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré' }))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer tous les livres
router.get('/', (req, res, next) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer un livre par son ID
router.get('/:id', (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
});

// Route PUT pour modifier un livre existant
router.put('/:id', (req, res, next) => {  
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) 
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

// Route DELETE pour supprimer un livre
router.delete('/:id', (req, res, next) => {  
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
});




module.exports = router;