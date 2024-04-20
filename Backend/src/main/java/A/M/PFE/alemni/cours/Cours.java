// Cours class
package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.comment.Comment;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "cours")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cours {
    @Id
    private ObjectId id ;
    private String title;
    private String description ;
    private double price ;
    private double rating ;
    private List<String> category; // Changed type to List<String>
    @DocumentReference
    private List<Comment>commentIds;
    private String DBid = new ObjectId().toString();
}
