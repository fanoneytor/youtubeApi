import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Link as MuiLink, IconButton } from '@mui/material';
import FavoriteVideoService from '../services/FavoriteVideoService';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoPlayer from './VideoPlayer';
import { toast } from 'react-toastify';

function FavoriteVideos() {
  const [favoriteVideos, setFavoriteVideos] = useState([]);
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
        toast.info("No tienes videos favoritos guardados.");
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
      toast.info("Video eliminado de favoritos.");
      fetchFavoriteVideos(); // Volver a cargar la lista
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error("Error al eliminar video de favoritos: " + resMessage);
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

        

        {selectedVideo && (
          <Grid container spacing={4} sx={{ mt: 4, width: '100%' }}>
            <Grid item xs={12} md={8}> 
              <VideoPlayer 
                videoId={selectedVideo.youtubeVideoId} 
                videoTitle={selectedVideo.title}
                videoThumbnailUrl={selectedVideo.thumbnailUrl}
              />
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

        <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {favoriteVideos.map((video) => (
            <Box 
              key={video.youtubeVideoId} 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.01)' },
              }}
              onClick={() => handleVideoClick(video)} 
            >
              <Box sx={{ width: 160, height: 90, flexShrink: 0, position: 'relative' }}> 
                <CardMedia
                  component="img"
                  image={video.thumbnailUrl}
                  alt={video.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" noWrap> 
                  {video.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {video.channelTitle}
                </Typography>
              </Box>
              <IconButton 
                aria-label="remove from favorites"
                sx={{ 
                  color: 'gray', 
                }}
                onClick={(event) => handleRemoveFavorite(event, video.youtubeVideoId)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default FavoriteVideos;