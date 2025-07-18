import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';
import YouTubeSearch from './components/YouTubeSearch'; // Importar el nuevo componente
import AuthService from './services/AuthService';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else if (location.pathname !== '/register') {
      navigate('/login'); // Redirigir a login si no hay usuario y no estamos en la página de registro
    }
  }, [navigate, location.pathname]);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YouTube App
          </Typography>
          {
            currentUser && (
              <>
                <Button color="inherit" component={Link} to="/youtube-search">Buscar Videos</Button>
                <Button color="inherit" onClick={logOut}>Cerrar Sesión</Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/youtube-search" element={<YouTubeSearch />} /> {/* Nueva ruta */}
        {/* Si hay un usuario, se puede acceder a la ruta principal, de lo contrario se redirige a login */}
        <Route path="/" element={currentUser ? <Home /> : <Login />} />
      </Routes>
    </Box>
  );
}

function Home() {
  return (
    <Typography variant="h4" component="h1" sx={{ mt: 4, textAlign: 'center' }}>
      Bienvenido a la Aplicación de YouTube
    </Typography>
  );
}

export default App;