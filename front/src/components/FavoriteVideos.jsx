import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Link as MuiLink, IconButton } from '@mui/material';
import FavoriteVideoService from '../services/FavoriteVideoService';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoPlayer from './VideoPlayer';

function FavoriteVideos() {
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null); 

  useEffect(() => {
    fetchFavoriteVideos();
  }, []);

  const fetchFavoriteVideos = async () => {
    setLoading(true);
    try {
      const response = await FavoriteVideoService.getFavoriteVideos();
      setFavoriteVideos(response.data);
      if (response.data.length === 0) {
        setMessage("No tienes videos favoritos guardados.");
      }
    } catch (error) {
      console.error("Error al cargar videos favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (event, youtubeVideoId) => {
    event.stopPropagation();
    try {
      await FavoriteVideoService.removeFavoriteVideo(youtubeVideoId);
      setMessage("Video eliminado de favoritos.");
      fetchFavoriteVideos(); // Volver a cargar la lista
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage("Error al eliminar video de favoritos: " + resMessage);
    }
  };

  const handleVideoClick = (videoItem) => {
    setSelectedVideo(videoItem); 
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl"> 
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Mis Videos Favoritos
        </Typography>

        {message && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 4 }}>
            {message}
          </Typography>
        )}

        {selectedVideo && (
          <Grid container spacing={4} sx={{ mt: 4, width: '100%' }}>
            <Grid item xs={12} md={8}> 
              <VideoPlayer videoId={selectedVideo.youtubeVideoId} />
            </Grid>
            <Grid item xs={12} md={4}> 
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedVideo.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {/* Aquí podrías añadir más información si la guardas en la BD */}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {favoriteVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.youtubeVideoId}> 
              <Card
                elevation={4} 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                  cursor: 'pointer', 
                }}
                onClick={() => handleVideoClick(video)} 
              >
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '40%' }}> 
                  <CardMedia
                    component="img"
                    image={video.thumbnailUrl}
                    alt={video.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton 
                    aria-label="remove from favorites"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: 'white', 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                      borderRadius: '50%', // Forma circular
                      padding: '6px', // Espaciado interno
                    }}
                    onClick={(event) => handleRemoveFavorite(event, video.youtubeVideoId)}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="subtitle1" component="div" noWrap> 
                    {video.title}
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

export default FavoriteVideos;