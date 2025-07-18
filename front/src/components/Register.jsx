import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link as MuiLink } from '@mui/material';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState(''); // Nuevo estado para fullname
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    AuthService.register(username, email, password, fullname).then(
      (response) => {
        setMessage(response.data.message);
        navigate('/login');
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      }
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullname"
            label="Nombre Completo"
            name="fullname"
            autoComplete="name"
            autoFocus
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de Usuario"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          {message && (
            <Typography color="error" variant="body2">
              {message}
            </Typography>
          )}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
            <MuiLink component={Link} to="/login" variant="body2">
              {"¿Ya tienes una cuenta? Inicia Sesión"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
