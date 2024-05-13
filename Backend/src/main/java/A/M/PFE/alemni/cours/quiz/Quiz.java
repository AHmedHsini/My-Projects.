package A.M.PFE.alemni.cours.quiz;

import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
    @Id
    private String id;
    private String title;
    private List<Question> questions;
    private String courseId; // Reference to the associated course's DBid
    @CreatedDate
    private LocalDateTime creationDate;
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    // Method to calculate the score based on provided answers
    public int calculateScore(List<Answer> providedAnswers) {
        int totalScore = 0;

        // Iterate through the questions and provided answers
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            Answer providedAnswer = providedAnswers.get(i);

            // Check if the provided answer is correct
            for (Answer correctAnswer : question.getAnswers()) {
                if (correctAnswer.equals(providedAnswer) && correctAnswer.isCorrect()) {
                    totalScore += question.getMark(); // Add the question's mark to the total score
                    break;
                }
            }
        }
        return totalScore;
    }
}

