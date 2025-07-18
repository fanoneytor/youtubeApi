package com.stefano.youtube_app.youtube.dto;

import lombok.Data;

@Data
public class FavoriteVideoRequest {
    private String youtubeVideoId;
    private String title;
    private String thumbnailUrl;
}
