package A.M.PFE.alemni.cours.quiz;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Document("Quiz Attempt")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttempt {
    private String quizId;
    private String userId;
    private List<Answer> providedAnswers;
    private int score; // Score achieved in the attempt
}