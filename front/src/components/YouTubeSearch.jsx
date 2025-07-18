import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Link as MuiLink, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import YouTubeService from '../services/YouTubeService';
import FavoriteVideoService from '../services/FavoriteVideoService'; 
import RecentlyViewedService from '../services/RecentlyViewedService'; 
import VideoPlayer from './VideoPlayer';

function YouTubeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); 
  const [favoriteVideoIds, setFavoriteVideoIds] = useState(new Set()); 
  const [recentlyViewed, setRecentlyViewed] = useState([]); 

  useEffect(() => {
    const loadFavoriteVideos = async () => {
      try {
        const response = await FavoriteVideoService.getFavoriteVideos();
        const ids = new Set(response.data.map(video => video.youtubeVideoId));
        setFavoriteVideoIds(ids);
      } catch (error) {
        console.error("Error al cargar videos favoritos:", error);
      }
    };
    loadFavoriteVideos();

    setRecentlyViewed(RecentlyViewedService.getRecentlyViewedVideos());
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setMessage('');
    setResults([]);
    setSelectedVideo(null); 
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

  const handleVideoClick = (videoItem) => {
    setSelectedVideo(videoItem); 
  };

  const handleFavoriteClick = async (event, videoItem) => {
    event.stopPropagation(); 
    const videoId = videoItem.id.videoId;

    try {
      if (favoriteVideoIds.has(videoId)) {
        await FavoriteVideoService.removeFavoriteVideo(videoId);
        setFavoriteVideoIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(videoId);
          return newIds;
        });
        setMessage("Video eliminado de favoritos.");
      } else {
        await FavoriteVideoService.addFavoriteVideo(
          videoId,
          videoItem.snippet.title,
          videoItem.snippet.thumbnails.high.url
        );
        setFavoriteVideoIds(prevIds => new Set(prevIds).add(videoId));
        setMessage("Video añadido a favoritos.");
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage("Error al gestionar favoritos: " + resMessage);
    }
  };

  return (
    <Container maxWidth="xl"> 
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

        {selectedVideo && (
          <Grid container spacing={4} sx={{ mt: 4, width: '100%' }}> 
            <Grid item xs={12} md={8}> 
              <VideoPlayer 
                videoId={selectedVideo.id.videoId} 
                videoTitle={selectedVideo.snippet.title}
                videoThumbnailUrl={selectedVideo.snippet.thumbnails.high.url}
                videoChannelTitle={selectedVideo.snippet.channelTitle} 
                videoDescription={selectedVideo.snippet.description} 
              />
            </Grid>
            <Grid item xs={12} md={4}> 
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedVideo.snippet.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {selectedVideo.snippet.channelTitle}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {selectedVideo.snippet.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Sección de Videos Vistos Recientemente */}
        {recentlyViewed.length > 0 && (
          <Box sx={{ mt: 8, width: '100%' }}>
            <Typography component="h2" variant="h5" gutterBottom>
              Videos Vistos Recientemente
            </Typography>
            <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 1 }}> {/* Ajuste para desplazamiento horizontal */}
              {recentlyViewed.map((video) => (
                <Grid item xs={4} key={video.youtubeVideoId}> {/* xs={4} para 3 columnas en una fila */}
                  <Card
                    elevation={4} 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)' },
                      cursor: 'pointer', 
                      minHeight: 300, 
                    }}
                    onClick={() => handleVideoClick({ id: { videoId: video.youtubeVideoId }, snippet: { title: video.title, channelTitle: video.channelTitle, description: video.description, thumbnails: { high: { url: video.thumbnailUrl } } } })} 
                  >
                    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}> 
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
        )}

        {/* Sección de Resultados de Búsqueda */}
        {results.length > 0 && ( 
          <Box sx={{ mt: 8, width: '100%' }}>
            <Typography component="h2" variant="h5" gutterBottom>
              Resultados de Búsqueda
            </Typography>
            <Grid container spacing={4}>
              {results.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id.videoId || item.id.channelId || item.id.playlistId}> 
                  <Card
                    elevation={4} 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)' },
                      cursor: 'pointer', 
                      minHeight: 300, 
                    }}
                    onClick={() => handleVideoClick(item)} 
                  >
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
                      <IconButton 
                        aria-label="add to favorites"
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          color: 'white', 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          borderRadius: '50%', 
                          padding: '6px', 
                        }}
                        onClick={(event) => handleFavoriteClick(event, item)}
                      >
                        {favoriteVideoIds.has(item.id.videoId) ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="subtitle1" component="div" noWrap> 
                        {item.snippet.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}> 
                        {item.snippet.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default YouTubeSearch;
