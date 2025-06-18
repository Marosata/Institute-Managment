const path = require('path');
const { Document } = require('../models');
const { AppError } = require('../middleware/error');
const { deleteFile } = require('../middleware/upload');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Aucun fichier n\'a été téléchargé', 400));
    }

    const document = await Document.create({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploaderId: req.user.id,
      visibility: req.body.visibility || 'private',
      accessRoles: req.body.accessRoles || [],
      tags: req.body.tags || []
    });

    res.status(201).json({
      status: 'success',
      data: {
        document
      }
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      await deleteFile(req.file.path);
    }
    next(error);
  }
};

const getAllDocuments = async (req, res, next) => {
  try {
    const conditions = {};

    // Filtrer par type
    if (req.query.type) {
      conditions.type = req.query.type;
    }

    // Filtrer par visibilité
    if (req.query.visibility) {
      conditions.visibility = req.query.visibility;
    }

    // Filtrer par tags
    if (req.query.tags) {
      conditions.tags = {
        [Op.overlap]: Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]
      };
    }

    // Filtrer par rôle d'accès si ce n'est pas un admin
    if (req.user.role !== 'admin') {
      conditions[Op.or] = [
        { uploaderId: req.user.id },
        { visibility: 'public' },
        {
          [Op.and]: [
            { visibility: 'restricted' },
            { accessRoles: { [Op.contains]: [req.user.role] } }
          ]
        }
      ];
    }

    const documents = await Document.findAll({
      where: conditions,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      results: documents.length,
      data: {
        documents
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError('Document non trouvé', 404));
    }

    // Vérifier les permissions d'accès
    if (document.visibility === 'private' && document.uploaderId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    if (document.visibility === 'restricted' && 
        !document.accessRoles.includes(req.user.role) && 
        document.uploaderId !== req.user.id && 
        req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    res.json({
      status: 'success',
      data: {
        document
      }
    });
  } catch (error) {
    next(error);
  }
};

const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError('Document non trouvé', 404));
    }

    // Vérifier les permissions d'accès
    if (document.visibility === 'private' && document.uploaderId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    if (document.visibility === 'restricted' && 
        !document.accessRoles.includes(req.user.role) && 
        document.uploaderId !== req.user.id && 
        req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    // Mettre à jour les statistiques de téléchargement
    await document.update({
      downloadCount: document.downloadCount + 1,
      lastDownloadDate: new Date()
    });

    res.download(document.filePath);
  } catch (error) {
    next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError('Document non trouvé', 404));
    }

    // Vérifier les permissions de modification
    if (document.uploaderId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    const updatedDocument = await document.update({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      visibility: req.body.visibility,
      accessRoles: req.body.accessRoles,
      tags: req.body.tags
    });

    res.json({
      status: 'success',
      data: {
        document: updatedDocument
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError('Document non trouvé', 404));
    }

    // Vérifier les permissions de suppression
    if (document.uploaderId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Accès non autorisé', 403));
    }

    // Supprimer le fichier physique
    await deleteFile(document.filePath);

    // Supprimer l'enregistrement
    await document.destroy();

    res.json({
      status: 'success',
      message: 'Document supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument
}; 