package A.M.PFE.alemni.cours.quiz;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
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
    public ResponseEntity<QuizAttempt> attemptQuiz(@PathVariable String quizId, @RequestBody QuizAttempt quizAttemptDto) {
        try {
            QuizAttempt completedAttempt = quizService.attemptQuiz(quizId, quizAttemptDto.getUserId(), quizAttemptDto.getProvidedAnswers());
            return ResponseEntity.ok(completedAttempt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
