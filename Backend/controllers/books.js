const Books = require('../models/books');

// Ajouter un livre
exports.createBook = (req, res, next) => {
  delete req.body._id;
  const books = new Books({
    ...req.body
  });
  books.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Récupérer un livre par ID
exports.getOneBook = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
};

// Modifier un livre
exports.updateBook = (req, res, next) => {
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};