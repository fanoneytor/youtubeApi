package com.stefano.youtube_app.youtube.controller;

import com.stefano.youtube_app.youtube.dto.YouTubeSearchResponse;
import com.stefano.youtube_app.youtube.service.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
