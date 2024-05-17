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

        // Iterate through each question in the quiz
        for (Question question : savedQuiz.getQuestions()) {
            // Find the correct answer for the question
            Answer correctAnswer = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .findFirst()
                    .orElse(null);

            // If a correct answer is found, update the question's list of answers
            if (correctAnswer != null) {
                question.getAnswers().removeIf(answer -> !answer.equals(correctAnswer)); // Remove incorrect answers
            }
        }

        // Return the saved quiz
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
    public QuizAttempt attemptQuiz(String quizId, String userId, List<Answer> providedAnswers) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (optionalQuiz.isPresent()) {
            Quiz quiz = optionalQuiz.get();
            List<Question> questions = quiz.getQuestions();
            int totalScore = 0;

            // Iterate through each question and evaluate the answers
            for (int i = 0; i < questions.size(); i++) {
                Question question = questions.get(i);
                Answer correctAnswer = question.getAnswers().stream()
                        .filter(Answer::isCorrect)
                        .findFirst()
                        .orElse(null);

                if (correctAnswer != null) {
                    Answer providedAnswer = providedAnswers.get(i);
                    if (providedAnswer != null && providedAnswer.equals(correctAnswer)) {
                        totalScore += question.getMark(); // Increment score for correct answer
                    }
                }
            }

            // Create a new QuizAttempt object with the calculated score
            QuizAttempt quizAttempt = new QuizAttempt(quizId, userId, providedAnswers, totalScore);
            return quizAttempt;
        } else {
            throw new RuntimeException("Quiz with ID " + quizId + " not found");
        }
    }
}
