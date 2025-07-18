import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import YouTubeSearch from './components/YouTubeSearch'; 
import FavoriteVideos from './components/FavoriteVideos'; 
import AuthService from './services/AuthService';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Si el usuario está autenticado y está en la ruta raíz o login, redirigir a la búsqueda
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/youtube-search'); 
      }
    } else if (location.pathname !== '/register') {
      navigate('/login'); 
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
                <Button color="inherit" component={Link} to="/favorites">Mis Favoritos</Button> 
                <Button color="inherit" onClick={logOut}>Cerrar Sesión</Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/youtube-search" element={<YouTubeSearch />} /> 
        <Route path="/favorites" element={<FavoriteVideos />} /> 
        {/* La ruta raíz ahora redirige a youtube-search si está autenticado, o a login si no */}
        <Route path="/" element={currentUser ? <YouTubeSearch /> : <Login />} />
      </Routes>
      <ToastContainer />
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