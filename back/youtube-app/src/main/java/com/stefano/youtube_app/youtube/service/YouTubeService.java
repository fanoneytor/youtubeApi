package com.stefano.youtube_app.youtube.service;

import com.stefano.youtube_app.youtube.dto.YouTubeSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class YouTubeService {

    @Value("${youtube.api-key}")
    private String youtubeApiKey;

    private final RestTemplate restTemplate;

    public YouTubeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
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
}
