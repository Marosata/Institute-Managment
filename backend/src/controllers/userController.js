const jwt = require('jsonwebtoken');
const { User, Student, Teacher } = require('../models');
const { AppError } = require('../middleware/error');
const config = require('../config/config');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber, address } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('Cette adresse email est déjà utilisée', 400));
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      address
    });

    // Créer le profil associé selon le rôle
    if (role === 'student') {
      await Student.create({
        userId: user.id,
        studentId: `STD${Date.now()}`,
        // Autres champs à remplir selon les besoins
      });
    } else if (role === 'teacher') {
      await Teacher.create({
        userId: user.id,
        employeeId: `TCH${Date.now()}`,
        // Autres champs à remplir selon les besoins
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    // Exclure le mot de passe de la réponse
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return next(new AppError('Email ou mot de passe incorrect', 401));
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return next(new AppError('Ce compte a été désactivé', 401));
    }

    // Générer le token
    const token = generateToken(user.id);

    // Mettre à jour la date de dernière connexion
    await user.update({ lastLogin: new Date() });

    // Exclure le mot de passe de la réponse
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      status: 'success',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Student,
          as: 'student',
          required: false
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false
        }
      ]
    });

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email, firstName, lastName, phoneNumber, address } = req.body;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: req.user.id } }
      });
      if (existingUser) {
        return next(new AppError('Cette adresse email est déjà utilisée', 400));
      }
    }

    // Mettre à jour l'utilisateur
    await req.user.update({
      email,
      firstName,
      lastName,
      phoneNumber,
      address
    });

    // Récupérer l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Vérifier le mot de passe actuel
    const user = await User.findByPk(req.user.id);
    if (!(await user.validatePassword(currentPassword))) {
      return next(new AppError('Mot de passe actuel incorrect', 401));
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: req.query
    });

    res.json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Student,
          as: 'student',
          required: false
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false
        }
      ]
    });

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    await user.update(req.body);

    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    await user.update({ isActive: false });

    res.json({
      status: 'success',
      message: 'Utilisateur désactivé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
}; 