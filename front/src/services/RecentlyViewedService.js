const RECENTLY_VIEWED_KEY = 'recentlyViewedVideos';
const MAX_RECENTLY_VIEWED = 3; // Limitar a los últimos 3 videos

const getRecentlyViewedVideos = () => {
  const videos = localStorage.getItem(RECENTLY_VIEWED_KEY);
  return videos ? JSON.parse(videos) : [];
};

const addRecentlyViewedVideo = (video) => {
  let videos = getRecentlyViewedVideos();

  // Eliminar el video si ya existe para moverlo al principio
  videos = videos.filter(v => v.youtubeVideoId !== video.youtubeVideoId);

  // Añadir el nuevo video al principio
  videos.unshift(video);

  // Limitar el número de videos
  if (videos.length > MAX_RECENTLY_VIEWED) {
    videos = videos.slice(0, MAX_RECENTLY_VIEWED);
  }

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(videos));
};

const clearRecentlyViewedVideos = () => {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
};

const RecentlyViewedService = {
  getRecentlyViewedVideos,
  addRecentlyViewedVideo,
  clearRecentlyViewedVideos,
};

export default RecentlyViewedService;