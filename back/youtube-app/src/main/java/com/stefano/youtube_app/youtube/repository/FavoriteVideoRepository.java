package com.stefano.youtube_app.youtube.repository;

import com.stefano.youtube_app.youtube.model.FavoriteVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteVideoRepository extends JpaRepository<FavoriteVideo, Long> {
    List<FavoriteVideo> findByUserId(Long userId);
    Optional<FavoriteVideo> findByYoutubeVideoIdAndUserId(String youtubeVideoId, Long userId);
}
