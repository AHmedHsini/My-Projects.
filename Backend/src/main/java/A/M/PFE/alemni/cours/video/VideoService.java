package A.M.PFE.alemni.cours.video;

import A.M.PFE.alemni.comment.Comment;
import A.M.PFE.alemni.comment.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private VideoWatchHistoryRepository videoWatchHistoryRepository;

    public Optional<Video> getVideoById(String videoId, String userId) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            if (video.getViewedBy() == null) {
                video.setViewedBy(new ArrayList<>());
            }
            if (video.getLikedBy() == null) {
                video.setLikedBy(new ArrayList<>());
            }
            if (!video.getViewedBy().contains(userId)) {
                video.incrementViews();
                video.getViewedBy().add(userId);
                videoRepository.save(video);
            }
        }
        return videoOptional;
    }

    public List<Video> getVideosByCourseId(String courseId) {
        return videoRepository.findVideosByCourseId(courseId);
    }

    public void likeVideo(String videoId, String userId) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            if (video.getLikedBy() == null) {
                video.setLikedBy(new ArrayList<>());
            }
            if (!video.getLikedBy().contains(userId)) {
                video.incrementLikes();
                video.getLikedBy().add(userId);
                videoRepository.save(video);
            } else {
                throw new RuntimeException("User has already liked this video");
            }
        } else {
            throw new RuntimeException("Video not found");
        }
    }

    public void unlikeVideo(String videoId, String userId) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            if (video.getLikedBy() != null && video.getLikedBy().contains(userId)) {
                video.decrementLikes();
                video.getLikedBy().remove(userId);
                videoRepository.save(video);
            } else {
                throw new RuntimeException("User has not liked this video");
            }
        } else {
            throw new RuntimeException("Video not found");
        }
    }

    public Comment addComment(String videoId, Comment comment) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            Comment savedComment = commentRepository.save(comment);

            // Initialize the commentIds list if it is null
            if (video.getCommentIds() == null) {
                video.setCommentIds(new ArrayList<>());
            }

            // Add the comment ID to the list of commentIds
            video.getCommentIds().add(savedComment);
            videoRepository.save(video);
            return savedComment;
        } else {
            throw new RuntimeException("Video not found");
        }
    }

    public void markAsWatched(String videoId, String userId, long timestamp, long duration) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            if (video.getViewedBy() == null) {
                video.setViewedBy(new ArrayList<>());
            }
            if (!video.getViewedBy().contains(userId)) {
                video.incrementViews();
                video.getViewedBy().add(userId);
                videoRepository.save(video);
            }

            // Update watch history
            Optional<VideoWatchHistory> watchHistoryOptional = videoWatchHistoryRepository.findByVideoIdAndUserId(videoId, userId);
            VideoWatchHistory watchHistory;
            if (watchHistoryOptional.isPresent()) {
                watchHistory = watchHistoryOptional.get();
            } else {
                watchHistory = new VideoWatchHistory();
                watchHistory.setVideoId(videoId);
                watchHistory.setUserId(userId);
            }
            watchHistory.setTimestamp(timestamp);
            watchHistory.setDuration(duration);
            videoWatchHistoryRepository.save(watchHistory);
        } else {
            throw new RuntimeException("Video not found");
        }
    }

    public Optional<VideoWatchHistory> getWatchHistory(String videoId, String userId) {
        return videoWatchHistoryRepository.findByVideoIdAndUserId(videoId, userId);
    }
}
