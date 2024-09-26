const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => { 
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);  
      }
});

// Middleware pour optimiser l'image téléchargée et redimensionner si nécessaire.
const optimizeImage = async (req, res, next) => {
    if (!req.file) return next(); 
  
    const originalImagePath = req.file.path; 
    const ext = path.extname(originalImagePath).toLowerCase(); 
    const isWebP = ext === '.webp'; 
    let optimizedImageName, optimizedImagePath;
  
    if (isWebP) {
     
      optimizedImageName = path.basename(originalImagePath);
      optimizedImagePath = originalImagePath;
    } else {
      
      optimizedImageName = `optimized_${path.basename(originalImagePath, ext)}.webp`; 
      optimizedImagePath = path.join('images', optimizedImageName); 
  
      try {
        await sharp(originalImagePath)
          .resize({ width: 500 }) 
          .webp({ quality: 80 }) 
          .toFile(optimizedImagePath); 
      } catch (error) {
        return next(error);
      }
  
 
      fs.unlink(originalImagePath, (error) => {
        if (error) {
          console.error("Impossible de supprimer l'image originale :", error);
          return next(error);
        }
      });
    }
  
    req.file.path = optimizedImagePath; 
    req.file.filename = optimizedImageName; 
  
    next(); 
  };
  
  const upload = multer({ storage }).single('image');
  
  module.exports = {
    upload,
    optimizeImage,
  };