const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema
} = require('../validations/userValidation');

// Routes publiques
router.post('/login', validate(loginSchema), userController.login);

// Routes protégées
router.use(auth); // Middleware d'authentification pour toutes les routes suivantes

// Routes pour le profil de l'utilisateur connecté
router.get('/profile', userController.getProfile);
router.patch('/profile', validate(updateUserSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// Routes administrateur
router.use(checkRole(['admin'])); // Middleware de vérification du rôle admin

router.route('/')
  .get(userController.getAllUsers)
  .post(validate(createUserSchema), userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router; 