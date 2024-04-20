package A.M.PFE.alemni.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private ObjectId id;
    private String body;

    public Comment(String body) {
        this.body = body;
    }
}
