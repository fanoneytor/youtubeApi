import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';

function VideoPlayer({ videoId }) {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 4 }}>
      <YouTube videoId={videoId} opts={opts} />
    </Box>
  );
}

export default VideoPlayer;
