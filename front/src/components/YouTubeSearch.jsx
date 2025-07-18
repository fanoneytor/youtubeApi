import React, { useState, useEffect, useRef } from 'react';
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

  const videoPlayerRef = useRef(null); 
  const searchResultsRef = useRef(null); 

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

    // Cargar videos vistos recientemente al inicio
    setRecentlyViewed(RecentlyViewedService.getRecentlyViewedVideos());
  }, []);

  // useEffect para desplazar al reproductor cuando selectedVideo cambie
  useEffect(() => {
    if (selectedVideo && videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedVideo]);

  // useEffect para desplazar a los resultados de búsqueda cuando results cambien
  useEffect(() => {
    if (results.length > 0 && searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

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
    // La actualización de recentlyViewed se hará a través del callback de VideoPlayer
  };

  const handleVideoPlayed = () => {
    // Este callback se ejecuta cuando VideoPlayer ha añadido el video a la lista de recientes
    setRecentlyViewed(RecentlyViewedService.getRecentlyViewedVideos());
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
          <Grid container spacing={4} sx={{ mt: 4, width: '100%' }} ref={videoPlayerRef}> 
            <Grid item xs={12} md={8}> 
              <VideoPlayer 
                videoId={selectedVideo.id.videoId} 
                videoTitle={selectedVideo.snippet.title}
                videoThumbnailUrl={selectedVideo.snippet.thumbnails.high.url}
                videoChannelTitle={selectedVideo.snippet.channelTitle} 
                videoDescription={selectedVideo.snippet.description} 
                onVideoPlayed={handleVideoPlayed}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> 
              {recentlyViewed.map((video) => (
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
                  onClick={() => handleVideoClick({ id: { videoId: video.youtubeVideoId }, snippet: { title: video.title, channelTitle: video.channelTitle, description: video.description, thumbnails: { high: { url: video.thumbnailUrl } } } })} 
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
                    aria-label="add to favorites"
                    sx={{ 
                      color: favoriteVideoIds.has(video.youtubeVideoId) ? 'red' : 'gray', 
                    }}
                    onClick={(event) => handleFavoriteClick(event, { id: { videoId: video.youtubeVideoId }, snippet: { title: video.title, thumbnails: { high: { url: video.thumbnailUrl } } } })}
                  >
                    {favoriteVideoIds.has(video.youtubeVideoId) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Sección de Resultados de Búsqueda */}
        {results.length > 0 && ( 
          <Box sx={{ mt: 8, width: '100%' }} ref={searchResultsRef}> 
            <Typography component="h2" variant="h5" gutterBottom>
              Resultados de Búsqueda
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> 
              {results.map((item) => (
                <Box 
                  key={item.id.videoId || item.id.channelId || item.id.playlistId} 
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
                  onClick={() => handleVideoClick(item)} 
                >
                  <Box sx={{ width: 160, height: 90, flexShrink: 0, position: 'relative' }}> 
                    <CardMedia
                      component="img"
                      image={item.snippet.thumbnails.high.url}
                      alt={item.snippet.title}
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
                      {item.snippet.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}> 
                      {item.snippet.channelTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}> 
                      {item.snippet.description}
                    </Typography>
                  </Box>
                  <IconButton 
                    aria-label="add to favorites"
                    sx={{ 
                      color: favoriteVideoIds.has(item.id.videoId) ? 'red' : 'gray', 
                    }}
                    onClick={(event) => handleFavoriteClick(event, item)}
                  >
                    {favoriteVideoIds.has(item.id.videoId) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default YouTubeSearch;