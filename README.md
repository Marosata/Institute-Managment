# Système de Gestion Scolaire

Une application complète de gestion scolaire permettant la gestion des élèves, des enseignants, des emplois du temps, et plus encore.

## Technologies Utilisées

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize

### Frontend
- React.js
- Tailwind CSS
- Material UI

### Authentification
- JWT

### Déploiement
- Docker

## Fonctionnalités Principales

- Gestion des utilisateurs (élèves, enseignants, administrateurs, parents)
- Gestion des élèves (inscription, suivi pédagogique)
- Gestion des enseignants
- Gestion des emplois du temps
- Gestion financière
- Communication interne
- Gestion documentaire

## Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installation des dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configuration
- Créer un fichier `.env` dans le dossier backend en suivant le modèle `.env.example`
- Créer un fichier `.env` dans le dossier frontend en suivant le modèle `.env.example`

4. Démarrer l'application
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Structure du Projet

```
.
├── backend/               # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Contrôleurs
│   │   ├── models/       # Modèles Sequelize
│   │   ├── routes/       # Routes API
│   │   ├── middleware/   # Middleware
│   │   └── utils/        # Utilitaires
│   └── tests/            # Tests
│
└── frontend/             # Application React
    ├── src/
    │   ├── components/   # Composants React
    │   ├── pages/        # Pages
    │   ├── services/     # Services API
    │   ├── store/        # État global
    │   └── utils/        # Utilitaires
    └── public/           # Fichiers statiques
```

## Licence

MIT