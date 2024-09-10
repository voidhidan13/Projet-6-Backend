const express = require('express');

const parsingMiddleware = express();

// Middleware pour parser le JSON
parsingMiddleware.use(express.json());

module.exports = parsingMiddleware;