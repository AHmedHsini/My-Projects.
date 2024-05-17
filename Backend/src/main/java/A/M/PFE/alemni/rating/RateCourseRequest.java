package A.M.PFE.alemni.rating;

import lombok.Data;

@Data
public class RateCourseRequest {
    private String userId;
    private String courseId;
    private int ratingValue;
}
