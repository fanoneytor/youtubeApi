import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link as MuiLink } from '@mui/material';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState(''); // Nuevo estado para fullname
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*]/.test(pwd);

    if (pwd.length < minLength) {
      return `La contraseña debe tener al menos ${minLength} caracteres.`;
    }
    if (!hasUppercase) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!hasLowercase) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }
    if (!hasDigit) {
      return 'La contraseña debe contener al menos un número.';
    }
    if (!hasSpecialChar) {
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*).';
    }
    return ''; // No error
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const pwdValidationMessage = validatePassword(password);
    if (pwdValidationMessage) {
      setPasswordError(pwdValidationMessage);
      return;
    }

    AuthService.register(username, email, password, fullname).then(
      (response) => {
        toast.success(response.data.message);
        navigate('/login');
      },
      (error) => {
          let resMessage = '';
          if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
              resMessage = error.response.data; // UserAlreadyExistsException message
            } else if (error.response.data.message) {
              resMessage = error.response.data.message; // Other backend messages
            } else if (error.response.data) {
              // Handle validation errors (MethodArgumentNotValidException)
              const errors = error.response.data;
              for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                  resMessage += `${errors[key]} `; // Concatenate all validation messages
                }
              }
            }
          } else {
            resMessage = error.message || error.toString();
          }
          toast.error(resMessage.trim());
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
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          
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
