import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Link as MuiLink } from '@mui/material';
import YouTubeService from '../services/YouTubeService';
import VideoPlayer from './VideoPlayer'; // Importar el VideoPlayer

function YouTubeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null); // Nuevo estado para el video seleccionado

  const handleSearch = async (event) => {
    event.preventDefault();
    setMessage('');
    setResults([]);
    setSelectedVideoId(null); // Limpiar video seleccionado al buscar
    setLoading(true);

    try {
      const response = await YouTubeService.searchVideos(query);
      setResults(response.data.items || []);
      if (response.data.items && response.data.items.length === 0) {
        setMessage("No se encontraron resultados para su búsqueda.");
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage("Error al buscar videos: " + resMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <Container maxWidth="xl"> {/* Cambiado a maxWidth="xl" para márgenes laterales */}
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Búsqueda de Videos de YouTube
        </Typography>
        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 3, width: '100%', display: 'flex', gap: 2 }}>
          <TextField
            margin="none"
            required
            fullWidth
            id="query"
            label="Buscar videos..."
            name="query"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ px: 4 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Buscar"}
          </Button>
        </Box>

        {message && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 4 }}>
            {message}
          </Typography>
        )}

        {selectedVideoId && <VideoPlayer videoId={selectedVideoId} />} {/* Mostrar reproductor si hay video seleccionado */}

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {results.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id.videoId || item.id.channelId || item.id.playlistId}> {/* Ajuste de breakpoints */}
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                  cursor: 'pointer', // Indicar que es clicable
                }}
                onClick={() => handleVideoClick(item.id.videoId)} // Manejar clic para reproducir
              >
                {/* Revertir a la relación de aspecto 16:9 */}
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={item.snippet.thumbnails.high.url}
                    alt={item.snippet.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {item.snippet.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.snippet.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default YouTubeSearch;
