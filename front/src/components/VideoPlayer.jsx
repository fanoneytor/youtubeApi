import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';
import RecentlyViewedService from '../services/RecentlyViewedService'; 

function VideoPlayer({ videoId, videoTitle, videoThumbnailUrl, videoChannelTitle, videoDescription, onVideoPlayed }) {
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
      channelTitle: videoChannelTitle, 
      description: videoDescription,   
    });
    if (onVideoPlayed) {
      onVideoPlayed(); // Notificar al padre que el video se ha añadido a la lista de recientes
    }
  };

  return (
    <Box sx={{ width: 640, height: 360, overflow: 'hidden', position: 'relative' }}> 
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
