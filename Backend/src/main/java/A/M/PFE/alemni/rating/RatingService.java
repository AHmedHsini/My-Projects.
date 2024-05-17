package A.M.PFE.alemni.rating;

import A.M.PFE.alemni.cours.Cours;
import A.M.PFE.alemni.cours.CoursRepository;
import A.M.PFE.alemni.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class RatingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoursRepository coursRepository;

    public synchronized void rateCourse(String userId, String courseId, int ratingValue) {
        // Validate rating value
        if (ratingValue < 1 || ratingValue > 5) {
            throw new IllegalArgumentException("Rating value must be between 1 and 5");
        }

        // Ensure user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find course by ID
        Cours course = coursRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (course.getRatings() == null) {
            course.setRatings(new ArrayList<>());
        }

        // Check if the user has already rated the course
        Rating existingRating = course.getRatings().stream()
                .filter(rating -> rating.getUserId().equals(userId))
                .findFirst()
                .orElse(null);

        if (existingRating != null) {
            // Update existing rating
            existingRating.setValue(ratingValue);
        } else {
            // Create and add new rating
            Rating rating = new Rating(userId, ratingValue);
            course.getRatings().add(rating);
        }

        // Calculate new average rating
        double totalRating = course.getRatings().stream().mapToInt(Rating::getValue).sum();
        double averageRating = totalRating / course.getRatings().size();
        course.setRating(averageRating); // Set the new average rating

        // Save course with updated rating and average
        coursRepository.save(course);
    }

    public Rating getUserRating(String userId, String courseId) {
        Cours course = coursRepository.findById(courseId).orElse(null);
        if (course == null || course.getRatings() == null) {
            return null;
        }

        return course.getRatings().stream()
                .filter(rating -> rating.getUserId().equals(userId))
                .findFirst()
                .orElse(null);
    }
}
