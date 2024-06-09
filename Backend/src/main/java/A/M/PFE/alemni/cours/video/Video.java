package A.M.PFE.alemni.cours.video;

import A.M.PFE.alemni.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "videos")
public class Video {
    @Id
    private String id;
    private String title;
    private String description;
    private String url;
    private int likes;
    private int views;
    @DocumentReference
    private List<Comment> commentIds;
    private String courseId;
    private List<String> likedBy;
    private List<String> viewedBy;

    public void incrementLikes() {
        this.likes++;
    }

    public void decrementLikes() {
        this.likes--;
    }

    public void incrementViews() {
        this.views++;
    }
}
