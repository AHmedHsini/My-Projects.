package A.M.PFE.alemni.cours.video;

import A.M.PFE.alemni.comment.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/{videoId}")
    public ResponseEntity<Video> getVideoById(@PathVariable String videoId, @RequestParam String userId) {
        Optional<Video> videoOptional = videoService.getVideoById(videoId, userId);
        if (videoOptional.isPresent()) {
            return new ResponseEntity<>(videoOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{videoId}/like")
    public ResponseEntity<?> likeVideo(@PathVariable String videoId, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        videoService.likeVideo(videoId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{videoId}/unlike")
    public ResponseEntity<?> unlikeVideo(@PathVariable String videoId, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        videoService.unlikeVideo(videoId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{videoId}/watch")
    public ResponseEntity<?> markVideoAsWatched(@PathVariable String videoId, @RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        long timestamp = ((Number) payload.get("timestamp")).longValue();
        long duration = ((Number) payload.get("duration")).longValue();
        videoService.markAsWatched(videoId, userId, timestamp, duration);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{videoId}/comments")
    public ResponseEntity<?> addComment(@PathVariable String videoId, @RequestBody Comment comment) {
        Comment savedComment = videoService.addComment(videoId, comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

    @GetMapping("/{videoId}/watch-history")
    public ResponseEntity<VideoWatchHistory> getWatchHistory(@PathVariable String videoId, @RequestParam String userId) {
        Optional<VideoWatchHistory> watchHistory = videoService.getWatchHistory(videoId, userId);
        return watchHistory.map(history -> new ResponseEntity<>(history, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
