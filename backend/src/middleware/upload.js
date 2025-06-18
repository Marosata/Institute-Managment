const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./error');
const config = require('../config/config');

// Créer le dossier d'upload s'il n'existe pas
const uploadDir = path.join(__dirname, '..', '..', config.UPLOAD_PATH);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Type de fichier non autorisé', 400), false);
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(config.MAX_FILE_SIZE) * 1024 * 1024 // Convertir en bytes
  }
});

// Middleware de gestion des erreurs Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`Taille de fichier maximale dépassée (${config.MAX_FILE_SIZE}MB)`, 400));
    }
    return next(new AppError(err.message, 400));
  }
  next(err);
};

// Middleware pour supprimer un fichier
const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
  }
};

module.exports = {
  upload,
  handleMulterError,
  deleteFile,
  uploadDir
}; 