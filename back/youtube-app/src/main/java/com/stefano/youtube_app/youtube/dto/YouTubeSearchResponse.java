package com.stefano.youtube_app.youtube.dto;

import lombok.Data;
import java.util.List;

@Data
public class YouTubeSearchResponse {
    private String kind;
    private String etag;
    private String nextPageToken;
    private String regionCode;
    private PageInfo pageInfo;
    private List<Item> items;

    @Data
    public static class PageInfo {
        private Integer totalResults;
        private Integer resultsPerPage;
    }

    @Data
    public static class Item {
        private String kind;
        private String etag;
        private Id id;
        private Snippet snippet;

        @Data
        public static class Id {
            private String kind;
            private String videoId;
            private String channelId;
            private String playlistId;
        }

        @Data
        public static class Snippet {
            private String publishedAt;
            private String channelId;
            private String title;
            private String description;
            private Thumbnails thumbnails;
            private String channelTitle;
            private String liveBroadcastContent;
            private String publishTime;
        }

        @Data
        public static class Thumbnails {
            private Thumbnail defaultThumbnail;
            private Thumbnail medium;
            private Thumbnail high;

            @Data
            public static class Thumbnail {
                private String url;
                private Integer width;
                private Integer height;
            }
        }
    }
}
