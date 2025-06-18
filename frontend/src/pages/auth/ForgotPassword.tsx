import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Entrez une adresse email valide')
    .required('L\'email est requis'),
});

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        await axios.post('http://localhost:5000/api/users/forgot-password', {
          email: values.email,
        });
        
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Mot de passe oublié
          </Typography>
          {success ? (
            <Box sx={{ mt: 3, width: '100%' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Un email de réinitialisation a été envoyé à votre adresse email.
              </Alert>
              <Link component={RouterLink} to="/login" variant="body2">
                Retour à la connexion
              </Link>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ mt: 3, width: '100%' }}
            >
              <Typography variant="body2" sx={{ mb: 3 }}>
                Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
              </Typography>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                name="email"
                label="Adresse email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Envoyer le lien'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Retour à la connexion
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 