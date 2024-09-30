const Book = require('../models/books')
const fs = require('fs');

exports.createBook = (req, res, next) => { 
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });

    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
    };

    exports.modifyBook = (req, res, next) => {
        const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-authorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({message : 'Livre modifié !'}))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

    exports.deleteBook = (req, res, next) => { 
        Book.findOne({ _id: req.params.id })
        .then((book) => {
          if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé' });
          } else {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              Book.deleteOne({ _id: req.params.id })
                .then(() => {
                  res.status(200).json({ message: 'Livre supprimé' });
                })
                .catch((error) => res.status(500).json({ error }));
            });
          }
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    };

    exports.getOneBook = (req, res, next) => {
        Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error}));
    };

    exports.getAllBooks =  (req, res, next) => {
        Book.find()
          .then(books => res.status(200).json(books))
          .catch(error => res.status(400).json({ error }));
      };

      exports.rateBook = (req, res, next) => {
        const userId = req.body.userId;
        const grade = req.body.rating;
    
        if (grade < 0 || grade > 5) {
            return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
        }
    
        Book.findOne({ _id: req.params.id })
            .then(book => {
                if (!book) {
                    return res.status(404).json({ message: "Le livre spécifié est introuvable!" });
                }
    
                if (book.userId === req.auth.userId) {
                    return res.status(401).json({ message: "Non-authorisé." });
                }
    
                const alreadyRated = book.ratings.some(rating => rating.userId === userId);
                if (alreadyRated) {
                    return res.status(401).json({ message: "Vous avez déjà noté ce livre." });
                }
    
                book.ratings.push({ userId, grade });
    
                const totalRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
                book.averageRating = parseFloat((totalRatings / book.ratings.length).toFixed(1));
    
                book.save()
                    .then(updatedBook => res.status(200).json(updatedBook))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    };

    exports.getBestRatedBooks = (req, res, next) => {
      Book.find().sort({ averageRating: -1 }).limit(3)
          .then(books => res.status(200).json(books))
          .catch(error => res.status(500).json({ error }));
  };
    