package A.M.PFE.alemni.cours.quiz;

import A.M.PFE.alemni.cours.Cours;
import A.M.PFE.alemni.cours.CoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CoursRepository coursRepository;

    public Quiz addQuiz(Quiz quiz) {
        // Save the quiz to the database
        Quiz savedQuiz = quizRepository.save(quiz);

        // Find the course by courseId
        Optional<Cours> optionalCours = coursRepository.findById(quiz.getCourseId());

        if (optionalCours.isPresent()) {
            Cours course = optionalCours.get();

            // Add the quiz to the course
            course.getQuizzes().add(savedQuiz);

            // Save the updated course
            coursRepository.save(course);
        } else {
            throw new RuntimeException("Course with ID " + quiz.getCourseId() + " not found");
        }

        return savedQuiz;
    }

    public Optional<Quiz> getQuizById(String id) {
        // Retrieve a quiz by its ID
        return quizRepository.findById(id);
    }

    public List<Quiz> getQuizzesByCourseId(String courseId) {
        // Retrieve quizzes associated with a specific course
        return quizRepository.findAllByCourseId(courseId);
    }

    public Quiz updateQuiz(String id, Quiz updatedQuiz) {
        // Update an existing quiz by ID
        Optional<Quiz> optionalQuiz = quizRepository.findById(id);
        if (optionalQuiz.isPresent()) {
            Quiz quiz = optionalQuiz.get();
            quiz.setTitle(updatedQuiz.getTitle());
            quiz.setQuestions(updatedQuiz.getQuestions());
            return quizRepository.save(quiz);
        } else {
            throw new RuntimeException("Quiz with ID " + id + " not found");
        }
    }

    public void deleteQuiz(String id) {
        // Delete a quiz by its ID
        quizRepository.deleteById(id);
    }

    public void deleteQuizzesByCourseId(String courseId) {
        List<Quiz> quizzes = quizRepository.findAllByCourseId(courseId);
        for (Quiz quiz : quizzes) {
            quizRepository.deleteById(quiz.getId());
        }
    }

    //quiz marking
    public QuizAttempt attemptQuiz(String quizId, String userId, List<Answer> providedAnswers) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (!optionalQuiz.isPresent()) {
            throw new RuntimeException("Quiz with ID " + quizId + " not found");
        }

        Quiz quiz = optionalQuiz.get();
        int score = quiz.calculateScore(providedAnswers);

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setQuizId(quizId);
        quizAttempt.setUserId(userId);
        quizAttempt.setProvidedAnswers(providedAnswers);
        quizAttempt.setScore(score);

        return quizAttempt;
    }

}
