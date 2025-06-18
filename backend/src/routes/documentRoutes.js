const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { auth, checkRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { validate } = require('../middleware/validator');
const { documentSchema } = require('../validations/documentValidation');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes pour tous les utilisateurs authentifiés
router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocument);
router.get('/:id/download', documentController.downloadDocument);

// Routes pour l'upload et la modification de documents
router.post('/',
  upload.single('file'),
  handleMulterError,
  validate(documentSchema),
  documentController.uploadDocument
);

router.patch('/:id',
  validate(documentSchema),
  documentController.updateDocument
);

// Route pour la suppression (accessible uniquement par l'uploader ou un admin)
router.delete('/:id', documentController.deleteDocument);

module.exports = router; 