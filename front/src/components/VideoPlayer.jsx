import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';
import RecentlyViewedService from '../services/RecentlyViewedService'; // Importar el servicio

function VideoPlayer({ videoId, videoTitle, videoThumbnailUrl }) {
  const opts = {
    playerVars: {
      autoplay: 1, 
      controls: 1, 
      rel: 0,      
      modestbranding: 1, 
    },
  };

  const onReady = (event) => {
    // Acceder al reproductor
    // event.target.pauseVideo();
    // Guardar el video en la lista de vistos recientemente
    RecentlyViewedService.addRecentlyViewedVideo({
      youtubeVideoId: videoId,
      title: videoTitle,
      thumbnailUrl: videoThumbnailUrl,
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}> 
      <YouTube
        videoId={videoId}
        opts={opts}
        className="youtube-iframe" 
        onReady={onReady} // Añadir el evento onReady
      />
    </Box>
  );
}

export default VideoPlayer;