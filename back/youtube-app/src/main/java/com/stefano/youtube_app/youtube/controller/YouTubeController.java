package com.stefano.youtube_app.youtube.controller;

import com.stefano.youtube_app.youtube.dto.FavoriteVideoRequest;
import com.stefano.youtube_app.youtube.dto.YouTubeSearchResponse;
import com.stefano.youtube_app.youtube.model.FavoriteVideo;
import com.stefano.youtube_app.youtube.service.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/youtube")
@RequiredArgsConstructor
public class YouTubeController {

    private final YouTubeService youtubeService;

    @GetMapping("/search")
    public ResponseEntity<YouTubeSearchResponse> searchVideos(@RequestParam String query) {
        YouTubeSearchResponse response = youtubeService.searchVideos(query);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/favorites")
    public ResponseEntity<FavoriteVideo> addFavoriteVideo(@RequestBody FavoriteVideoRequest request) {
        try {
            FavoriteVideo savedVideo = youtubeService.saveFavoriteVideo(
                    request.getYoutubeVideoId(),
                    request.getTitle(),
                    request.getThumbnailUrl()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVideo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Video already favorited
        }
    }

    @DeleteMapping("/favorites/{youtubeVideoId}")
    public ResponseEntity<Void> removeFavoriteVideo(@PathVariable String youtubeVideoId) {
        youtubeService.removeFavoriteVideo(youtubeVideoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<FavoriteVideo>> getFavoriteVideos() {
        List<FavoriteVideo> favoriteVideos = youtubeService.getFavoriteVideos();
        return ResponseEntity.ok(favoriteVideos);
    }

    @GetMapping("/favorites/check/{youtubeVideoId}")
    public ResponseEntity<Boolean> checkFavorite(@PathVariable String youtubeVideoId) {
        boolean isFavorite = youtubeService.isFavorite(youtubeVideoId);
        return ResponseEntity.ok(isFavorite);
    }
}