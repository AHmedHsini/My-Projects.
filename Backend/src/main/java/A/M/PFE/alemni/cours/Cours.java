package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.comment.Comment;
import A.M.PFE.alemni.rating.Rating;
import A.M.PFE.alemni.cours.quiz.Quiz;

import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "cours")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cours {
    @Id
    private String id;
    private String title;
    private String description;
    private double price;
    private double rating = 0.0;
    private List<String> category;
    private String courseImage; // URL to the course's main image
    private List<Media> media = new ArrayList<>(); // List to store different media types
    @DocumentReference
    private List<Comment> commentIds ;
    private List<Rating> ratings = new ArrayList<>();
    @DocumentReference
    private List<Quiz> quizzes  ;
    private String educatorName; // Store the name of the educator who created the course
    private String educatorId;
    @CreatedDate
    private LocalDateTime creationDate;
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;


}
