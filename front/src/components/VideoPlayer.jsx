import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';
import RecentlyViewedService from '../services/RecentlyViewedService'; 

function VideoPlayer({ videoId, videoTitle, videoThumbnailUrl, videoChannelTitle, videoDescription }) {
  const opts = {
    playerVars: {
      autoplay: 1, 
      controls: 1, 
      rel: 0,      
      modestbranding: 1, 
    },
  };

  const onReady = (event) => {
    RecentlyViewedService.addRecentlyViewedVideo({
      youtubeVideoId: videoId,
      title: videoTitle,
      thumbnailUrl: videoThumbnailUrl,
      channelTitle: videoChannelTitle, // Guardar el título del canal
      description: videoDescription,   // Guardar la descripción
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}> 
      <YouTube
        videoId={videoId}
        opts={opts}
        className="youtube-iframe" 
        onReady={onReady} 
      />
    </Box>
  );
}

export default VideoPlayer;
