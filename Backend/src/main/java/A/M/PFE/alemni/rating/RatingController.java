package A.M.PFE.alemni.rating;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<String> rateCourse(@RequestBody RateCourseRequest request) {
        ratingService.rateCourse(request.getUserId(), request.getCourseId(), request.getRatingValue());
        return ResponseEntity.status(HttpStatus.CREATED).body("Course rated successfully");
    }

    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<Rating> getUserRating(@PathVariable String userId, @PathVariable String courseId) {
        Rating rating = ratingService.getUserRating(userId, courseId);
        if (rating != null) {
            return ResponseEntity.ok(rating);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
