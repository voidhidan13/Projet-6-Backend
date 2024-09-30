const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, optimizeImage } = require('../middleware/multer-config');

const bookCtrl = require('../controllers/books')

router.post('/', auth, upload, optimizeImage, bookCtrl.createBook); 
router.put('/:id', auth, upload, optimizeImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);
router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;