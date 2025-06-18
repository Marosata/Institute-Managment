const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentification requise'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    const user = await User.findOne({
      where: { id: decoded.id, isActive: true },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error();
    }

    // Mettre à jour la date de dernière connexion
    await User.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Veuillez vous authentifier'
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }
    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 