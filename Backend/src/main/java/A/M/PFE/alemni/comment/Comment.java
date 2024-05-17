package A.M.PFE.alemni.comment;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String body;
    private String commenterId;
    private String commenterName;
    private String commenterLastName;
    private String courseId;  // Add this field

    public Comment(String body, String commenterId, String commenterName, String commenterLastName, String courseId) {
        this.body = body;
        this.commenterId = commenterId;
        this.commenterName = commenterName;
        this.commenterLastName = commenterLastName;
        this.courseId = courseId;  // Set this field in the constructor
    }
}
