const Joi = require('joi');

const userRoles = ['admin', 'teacher', 'student', 'parent'];

const createUserSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'L\'adresse email n\'est pas valide',
      'any.required': 'L\'adresse email est requise'
    }),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      'any.required': 'Le mot de passe est requis'
    }),
  firstName: Joi.string().required()
    .messages({
      'any.required': 'Le prénom est requis'
    }),
  lastName: Joi.string().required()
    .messages({
      'any.required': 'Le nom est requis'
    }),
  role: Joi.string().valid(...userRoles).required()
    .messages({
      'any.only': 'Le rôle doit être l\'un des suivants : ' + userRoles.join(', '),
      'any.required': 'Le rôle est requis'
    }),
  phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null)
    .messages({
      'string.pattern.base': 'Le numéro de téléphone n\'est pas valide'
    }),
  address: Joi.string().allow(null)
});

const updateUserSchema = Joi.object({
  email: Joi.string().email()
    .messages({
      'string.email': 'L\'adresse email n\'est pas valide'
    }),
  password: Joi.string().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null)
    .messages({
      'string.pattern.base': 'Le numéro de téléphone n\'est pas valide'
    }),
  address: Joi.string().allow(null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'L\'adresse email n\'est pas valide',
      'any.required': 'L\'adresse email est requise'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Le mot de passe est requis'
    })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'any.required': 'Le mot de passe actuel est requis'
    }),
  newPassword: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.min': 'Le nouveau mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      'any.required': 'Le nouveau mot de passe est requis'
    })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema
}; 