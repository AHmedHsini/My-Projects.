package A.M.PFE.alemni.cours.quiz;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttempt {
    private String quizId;
    private String userId;
    private List<Answer> providedAnswers;
    private int score; // Score achieved in the attempt
}