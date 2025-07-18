package com.stefano.youtube_app.youtube.service;

import com.stefano.youtube_app.auth.user.User;
import com.stefano.youtube_app.auth.repository.UserRepository;
import com.stefano.youtube_app.youtube.dto.YouTubeSearchResponse;
import com.stefano.youtube_app.youtube.model.FavoriteVideo;
import com.stefano.youtube_app.youtube.repository.FavoriteVideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@Service
public class YouTubeService {

    @Value("${youtube.api-key}")
    private String youtubeApiKey;

    private final RestTemplate restTemplate;
    private final FavoriteVideoRepository favoriteVideoRepository;
    private final UserRepository userRepository;

    public YouTubeService(RestTemplate restTemplate, FavoriteVideoRepository favoriteVideoRepository, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.favoriteVideoRepository = favoriteVideoRepository;
        this.userRepository = userRepository;
    }

    public YouTubeSearchResponse searchVideos(String query) {
        String url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                .queryParam("part", "snippet")
                .queryParam("q", query)
                .queryParam("type", "video")
                .queryParam("key", youtubeApiKey)
                .toUriString();
        return restTemplate.getForObject(url, YouTubeSearchResponse.class);
    }

    public FavoriteVideo saveFavoriteVideo(String youtubeVideoId, String title, String thumbnailUrl) {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        Optional<FavoriteVideo> existingVideo = favoriteVideoRepository.findByYoutubeVideoIdAndUserId(youtubeVideoId, currentUser.getId());
        if (existingVideo.isPresent()) {
            throw new RuntimeException("Video already favorited");
        }

        FavoriteVideo favoriteVideo = FavoriteVideo.builder()
                .youtubeVideoId(youtubeVideoId)
                .title(title)
                .thumbnailUrl(thumbnailUrl)
                .user(currentUser)
                .build();
        return favoriteVideoRepository.save(favoriteVideo);
    }

    public void removeFavoriteVideo(String youtubeVideoId) {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        favoriteVideoRepository.findByYoutubeVideoIdAndUserId(youtubeVideoId, currentUser.getId())
                .ifPresent(favoriteVideoRepository::delete);
    }

    public List<FavoriteVideo> getFavoriteVideos() {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        return favoriteVideoRepository.findByUserId(currentUser.getId());
    }

    public boolean isFavorite(String youtubeVideoId) {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return false; // O manejar como error si se prefiere
        }
        return favoriteVideoRepository.findByYoutubeVideoIdAndUserId(youtubeVideoId, currentUser.getId()).isPresent();
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElse(null);
    }
}