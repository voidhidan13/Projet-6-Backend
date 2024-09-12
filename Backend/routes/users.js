const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

//Route POST pour s'inscire 
router.post('/signup', userCtrl.signup);

//Route POST pour se connecter 
router.post('/login', userCtrl.login);

// Route POST pour le mot de passe oublié
router.post('/forgot-password', userCtrl.forgotPassword); 


module.exports = router;