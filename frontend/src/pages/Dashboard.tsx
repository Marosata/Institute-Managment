import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RootState } from '../store';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Ces données devraient venir de l'API dans une vraie application
  const stats = {
    totalStudents: 450,
    totalTeachers: 32,
    activeAssignments: 24,
    pendingPayments: 15,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Tableau de bord
        </Typography>
        <IconButton>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Étudiants"
            value={stats.totalStudents}
            icon={<SchoolIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Enseignants"
            value={stats.totalTeachers}
            icon={<PeopleIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Devoirs actifs"
            value={stats.activeAssignments}
            icon={<AssignmentIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Paiements en attente"
            value={stats.pendingPayments}
            icon={<PaymentIcon />}
            color="#9c27b0"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bienvenue, {user?.firstName} !
            </Typography>
            <Typography variant="body1">
              Voici un aperçu des statistiques importantes de votre établissement.
              Utilisez le menu de gauche pour accéder aux différentes fonctionnalités.
            </Typography>
          </Paper>
        </Grid>

        {/* Ici, nous pourrions ajouter d'autres sections comme :
            - Graphiques d'évolution
            - Liste des dernières activités
            - Calendrier des événements
            - Notifications importantes
        */}
      </Grid>
    </Container>
  );
};

export default Dashboard; 