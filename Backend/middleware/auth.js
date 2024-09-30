const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
       if (!token) {
           return res.status(401).json({ message: 'Token not found!' });
       }

       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decodedToken && decodedToken.userId;
       if (!userId) {
           return res.status(401).json({ message: 'Invalid token!' });
       }

       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       res.status(401).json({ message: 'Authentication failed!' });
   }
};