const Joi = require('joi');

const documentTypes = [
  'administrative',
  'academic',
  'financial',
  'medical',
  'report',
  'certificate',
  'course_material',
  'other'
];

const visibilityTypes = ['public', 'private', 'restricted'];

const documentSchema = Joi.object({
  title: Joi.string().required()
    .messages({
      'any.required': 'Le titre est requis',
      'string.empty': 'Le titre ne peut pas être vide'
    }),

  type: Joi.string().valid(...documentTypes).required()
    .messages({
      'any.required': 'Le type de document est requis',
      'any.only': `Le type doit être l'un des suivants : ${documentTypes.join(', ')}`
    }),

  description: Joi.string().allow('').optional()
    .messages({
      'string.base': 'La description doit être une chaîne de caractères'
    }),

  visibility: Joi.string().valid(...visibilityTypes).default('private')
    .messages({
      'any.only': `La visibilité doit être l'une des suivantes : ${visibilityTypes.join(', ')}`
    }),

  accessRoles: Joi.array().items(
    Joi.string().valid('admin', 'teacher', 'student', 'parent')
  ).when('visibility', {
    is: 'restricted',
    then: Joi.array().min(1).required()
      .messages({
        'array.min': 'Au moins un rôle doit être spécifié pour la visibilité restreinte',
        'any.required': 'Les rôles d\'accès sont requis pour la visibilité restreinte'
      })
  }),

  tags: Joi.array().items(Joi.string()).default([])
    .messages({
      'array.base': 'Les tags doivent être un tableau',
      'string.base': 'Chaque tag doit être une chaîne de caractères'
    })
}).messages({
  'object.unknown': 'Ce champ n\'est pas autorisé'
});

module.exports = {
  documentSchema
}; 