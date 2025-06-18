const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const { errorHandler } = require('./middleware/error');
const { sequelize } = require('./models');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Création de l'application Express
const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Parser JSON
app.use(express.json({ limit: config.MAX_FILE_SIZE }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API du système de gestion scolaire' });
});

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
// Ajouter d'autres routes ici

// Gestion des routes non trouvées
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} non trouvée`
  });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Connexion à la base de données et démarrage du serveur
const PORT = config.PORT;

const startServer = async () => {
  try {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: config.NODE_ENV === 'development' });
    console.log('Base de données synchronisée');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT} en mode ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer(); 