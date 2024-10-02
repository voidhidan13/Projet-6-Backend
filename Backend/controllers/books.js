const Book = require('../models/books') 
const fs = require('fs');

/*
 * Fonction pour créer un livre
 */
exports.createBook = (req, res, next) => { 

  const bookObject = JSON.parse(req.body.book);

  // On supprime les propriétés _id et _userId car elles seront gérées automatiquement
  delete bookObject._id;
  delete bookObject._userId;

  
  const book = new Book({
    ...bookObject, // Copie les propriétés de l'objet bookObject
    userId: req.auth.userId, // Associe le livre à l'utilisateur actuellement authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Génère l'URL de l'image du livre
  });

 
  book.save()
    .then(() => { 
      res.status(201).json({message: 'Livre enregistré !'}) // Réponse en cas de succès
    })
    .catch(error => { 
      res.status(400).json({ error }) 
    });
};

/*
 * Fonction pour modifier un livre
 */
exports.modifyBook = (req, res, next) => {
  
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book), // On parse et copie les nouvelles données envoyées
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, 
      }
    : { ...req.body }; // Si pas de nouvelle image, on utilise uniquement le corps de la requête

  delete bookObject._userId; // L'ID utilisateur ne doit pas être modifié

  // Recherche du livre par son identifiant (ID)
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si l'utilisateur n'est pas celui qui a créé le livre, on refuse la modification
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-authorisé" });
      } else {
       
        Book.updateOne(
          { _id: req.params.id }, 
          { ...bookObject, _id: req.params.id } 
        )
          .then(() => res.status(200).json({ message: 'Livre modifié !' })) 
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*
 * Fonction pour supprimer un livre
 */
exports.deleteBook = (req, res, next) => {

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si l'utilisateur n'est pas celui qui a créé le livre, on refuse la suppression
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        // Récupération du nom de fichier de l'image associée au livre
        const filename = book.imageUrl.split("/images/")[1];
        // Suppression de l'image du système de fichiers
        fs.unlink(`images/${filename}`, () => {
          // Suppression du livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé' }); // Réponse en cas de succès
            })
            .catch((error) => res.status(500).json({ error })); 
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); 
    });
};

/*
 * Fonction pour récupérer un livre par son id
 */
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) 
    .then(book => res.status(200).json(book)) 
    .catch(error => res.status(404).json({ error })); 
};

/*
 * Fonction pour récupérer tous les livres
 */
exports.getAllBooks = (req, res, next) => {
  Book.find() 
    .then(books => res.status(200).json(books)) 
    .catch(error => res.status(400).json({ error })); 
};

/*
 * Fonction pour noter un livre
 */
exports.rateBook = (req, res, next) => {
  const userId = req.body.userId; // Récupération de l'ID utilisateur qui note
  const grade = req.body.rating; // Récupération de la note (rating)

  // Vérification que la note est bien comprise entre 0 et 5
  if (grade < 0 || grade > 5) {
    return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
  }

 
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Le livre spécifié est introuvable!" });
      }

      // empêche l'auteur du livre de le noter lui-même
      if (book.userId === req.auth.userId) {
        return res.status(401).json({ message: "Non-authorisé." });
      }

      // Vérification que l'utilisateur n'a pas déjà noté le livre
      const alreadyRated = book.ratings.some(rating => rating.userId === userId);
      if (alreadyRated) {
        return res.status(401).json({ message: "Vous avez déjà noté ce livre." });
      }


      book.ratings.push({ userId, grade });

      // Calcul de la note moyenne
      const totalRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
      book.averageRating = parseFloat((totalRatings / book.ratings.length).toFixed(1));

      
      book.save()
        .then(updatedBook => res.status(200).json(updatedBook)) 
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error })); 
};

/*
 * Fonction pour récupérer les 3 livres les mieux notés
 */
exports.getBestRatedBooks = (req, res, next) => {
  // Tri par ordre decroisant
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books)) 
    .catch(error => res.status(500).json({ error })); 
};
