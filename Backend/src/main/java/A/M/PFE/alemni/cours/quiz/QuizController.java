package A.M.PFE.alemni.cours.quiz;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<Quiz> addQuiz(@Valid @RequestBody Quiz quiz) {
        // Endpoint to add a new quiz
        Quiz createdQuiz = quizService.addQuiz(quiz);
        return ResponseEntity.ok(createdQuiz);
    }

    @GetMapping("/{quizzidid}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String quizzidid) {
        // Endpoint to retrieve a quiz by ID
        Optional<Quiz> quiz = quizService.getQuizById(quizzidid);
        return quiz.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/Courses/{courseId}")
    public ResponseEntity<List<Quiz>> getQuizzesByCourseId(@PathVariable String courseId) {
        // Endpoint to retrieve quizzes associated with a specific course
        List<Quiz> quizzes = quizService.getQuizzesByCourseId(courseId);
        return ResponseEntity.ok(quizzes);
    }

    @PutMapping("/{quizzid}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String quizzid, @RequestBody Quiz updatedQuiz) {
        // Endpoint to update an existing quiz
        Quiz quiz = quizService.updateQuiz(quizzid, updatedQuiz);
        if (quiz != null) {
            return ResponseEntity.ok(quiz);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{quizzidid}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String quizzidid) {
        // Endpoint to delete a quiz by ID
        quizService.deleteQuiz(quizzidid);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{quizId}/attempt")
    public ResponseEntity<QuizAttempt> attemptQuiz(@PathVariable String quizId, @RequestBody Map<String, Object> requestBody) {
        // Extract userId from the request body
        String userId = (String) requestBody.get("userId");

        // Extract providedAnswers from the request body
        List<List<Map<String, Object>>> providedAnswers = (List<List<Map<String, Object>>>) requestBody.get("providedAnswers");

        // Convert providedAnswers to List<Answer>
        List<Answer> answers = new ArrayList<>();
        for (List<Map<String, Object>> answerList : providedAnswers) {
            for (Map<String, Object> answerMap : answerList) {
                // Assuming "text" is the key for the answer text and "correct" is the key for the correctness flag
                String text = (String) answerMap.get("text");
                Boolean correct = (Boolean) answerMap.get("correct");
                answers.add(new Answer(text, correct));
            }
        }

        // Call your attemptQuiz method passing quizId, userId, and providedAnswers
        QuizAttempt quizAttempt = quizService.attemptQuiz(quizId, userId, answers);

        // Return the ResponseEntity
        return ResponseEntity.ok(quizAttempt);
    }

}
