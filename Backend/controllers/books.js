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

// Noter un livre

exports.rateBooks = (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;

  if (grade < 0 || grade > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
  }

  Books.findOne({ _id: req.params.id })
      .then(books => {
          if (!books) {
              return res.status(404).json({ message: "Le livre spécifié est introuvable!" });
          }

          if (books.userId === req.auth.userId) {
              return res.status(401).json({ message: "Non-authorisé." });
          }

          const alreadyRated = books.ratings.some(rating => rating.userId === userId);
          if (alreadyRated) {
              return res.status(401).json({ message: "Vous avez déjà noté ce livre." });
          }

          books.ratings.push({ userId, grade });

          const totalRatings = books.ratings.reduce((acc, rating) => acc + rating.grade, 0);
          books.averageRating = parseFloat((totalRatings / books.ratings.length).toFixed(1));

          books.save()
              .then(updatedBooks => res.status(200).json(updatedBooks))
              .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

//Trois meilleures moyennes
exports.getBestRatedBooks = (req, res, next) => {
Books.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(500).json({ error }));
};
