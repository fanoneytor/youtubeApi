import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api/v1/youtube/';

const searchVideos = (query) => {
  const user = AuthService.getCurrentUser();
  if (!user || !user.token) {
    return Promise.reject("No authentication token found.");
  }

  return axios.get(API_URL + 'search', {
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
    params: {
      query: query, // Cambiado de 'q' a 'query'
    },
  });
};

const YouTubeService = {
  searchVideos,
};

export default YouTubeService;