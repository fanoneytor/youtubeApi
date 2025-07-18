import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Link as MuiLink } from '@mui/material';
import YouTubeService from '../services/YouTubeService';

function YouTubeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setMessage('');
    setResults([]);
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

  return (
    <Container maxWidth={false}> 
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

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {results.map((item) => (
            <Grid item xs={3} sm={3} md={3} lg={3} key={item.id.videoId || item.id.channelId || item.id.playlistId}> 
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <MuiLink
                  href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box sx={{ width: 240, height: 135, overflow: 'hidden' }}> {/* Ancho y alto fijo para probar */}
                    <CardMedia
                      component="img"
                      image={item.snippet.thumbnails.high.url}
                      alt={item.snippet.title}
                      sx={{
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
                </MuiLink>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default YouTubeSearch;