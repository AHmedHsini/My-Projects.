package A.M.PFE.alemni.cours.quiz;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    private String questionText;
    private List<Answer> answers;
    private int mark; // Marks for this question
}
