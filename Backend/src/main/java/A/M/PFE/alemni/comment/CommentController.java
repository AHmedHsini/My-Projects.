package A.M.PFE.alemni.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Map<String, String> payload) {
        String commentBody = payload.get("commentBody");
        String commenterId = payload.get("commenterId");
        String courseId = payload.get("courseId");
        String videoId = payload.get("videoId"); // Add videoId to payload

        // Check if commentBody is empty
        if (commentBody == null || commentBody.isEmpty()) {
            return ResponseEntity.badRequest().body("Please provide a comment.");
        }

        // Check if commenterId is empty (not logged in)
        if (commenterId == null || commenterId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please log in to comment.");
        }

        // Check if courseId or videoId is provided
        if ((courseId == null || courseId.isEmpty()) && (videoId == null || videoId.isEmpty())) {
            return ResponseEntity.badRequest().body("Please provide a course ID or a video ID.");
        }

        if (videoId != null && !videoId.isEmpty()) {
            return new ResponseEntity<>(commentService.createCommentForVideo(commentBody, commenterId, videoId), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(commentService.createComment(commentBody, commenterId, courseId), HttpStatus.CREATED);
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Comment>> getCommentsByCourseId(@PathVariable String courseId) {
        List<Comment> comments = commentService.getCommentsByCourseId(courseId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<Comment>> getCommentsByVideoId(@PathVariable String videoId) {
        List<Comment> comments = commentService.getCommentsByVideoId(videoId);
        return ResponseEntity.ok(comments);
    }
}
