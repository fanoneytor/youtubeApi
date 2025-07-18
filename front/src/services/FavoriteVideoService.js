import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api/v1/youtube/favorites';

const getAuthHeader = () => {
  const user = AuthService.getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const addFavoriteVideo = (youtubeVideoId, title, thumbnailUrl) => {
  return axios.post(API_URL, {
    youtubeVideoId,
    title,
    thumbnailUrl,
  }, { headers: getAuthHeader() });
};

const removeFavoriteVideo = (youtubeVideoId) => {
  return axios.delete(`${API_URL}/${youtubeVideoId}`, { headers: getAuthHeader() });
};

const getFavoriteVideos = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const checkFavorite = (youtubeVideoId) => {
  return axios.get(`${API_URL}/check/${youtubeVideoId}`, { headers: getAuthHeader() });
};

const FavoriteVideoService = {
  addFavoriteVideo,
  removeFavoriteVideo,
  getFavoriteVideos,
  checkFavorite,
};

export default FavoriteVideoService;
