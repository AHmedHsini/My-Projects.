import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./QuizAttemptPage.css";

function QuizAttemptPage() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem(`answers_${quizId}`);
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState({});

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await axios.get(`/api/quiz/${quizId}`);
                setQuiz(response.data);
                if (Object.keys(answers).length === 0) {
                    initAnswers(response.data.questions);
                }
            } catch (error) {
                console.error("Failed to fetch quiz details:", error);
                setError("Failed to load quiz. Please try again later.");
            }
        };
        fetchQuizDetails();
    }, [quizId]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (submitted) {
                const message = "You have submitted your quiz. Reloading the page may cause you to lose your results.";
                event.returnValue = message; // Standard for most browsers
                return message; // For some older browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [submitted]);

    const initAnswers = (questions) => {
        const initialAnswers = {};
        questions.forEach(question => {
            initialAnswers[question.questionText] = [];
        });
        setAnswers(initialAnswers);
    };

    const handleAnswerChange = (questionId, selectedOption, isChecked) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: isChecked
                ? [...prevAnswers[questionId], selectedOption]
                : prevAnswers[questionId].filter(opt => opt !== selectedOption),
        }));
    };

    const evaluateQuiz = () => {
        const evaluationResult = {};
        let totalScore = 0;
        quiz.questions.forEach(question => {
            const correctAnswers = question.answers.filter(answer => answer.correct).map(answer => answer.text);
            const userAnswers = answers[question.questionText];
            const correct = userAnswers && userAnswers.every(answer => correctAnswers.includes(answer));
            evaluationResult[question.questionText] = {
                correctAnswers,
                userAnswers,
                correct
            };
            if (correct) {
                totalScore += question.mark;
            }
        });
        setScore(totalScore);
        setEvaluation(evaluationResult);
        setSubmitted(true);
    };

    const handleSubmit = async () => {
        if (submitting || submitted) return;
        setSubmitting(true);
        evaluateQuiz();
        localStorage.removeItem(`answers_${quizId}`);
        setSubmitting(false);
    };

    if (error) return <div className="error">{error}</div>;
    if (!quiz) return <div className="loading">Loading...</div>;

    return (
        <div className="quiz-container">
            <h1 className="quiz-title">{quiz.title}</h1>
            {quiz.questions.map(question => (
                <div key={question.questionText} className="question-container">
                    <h3 className="question-text">{question.questionText}</h3>
                    <ul className="answer-list">
                        {question.answers.map(answer => (
                            <li key={answer.text} className="answer-item">
                                <label className="answer-label">
                                    {question.answers.length === 1 ? (
                                        <input
                                            type="radio"
                                            value={answer.text}
                                            checked={answers[question.questionText].includes(answer.text)}
                                            onChange={(e) => handleAnswerChange(question.questionText, answer.text, e.target.checked)}
                                            className="answer-input"
                                            disabled={submitted}
                                            aria-label={`Select ${answer.text}`}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            value={answer.text}
                                            checked={answers[question.questionText].includes(answer.text)}
                                            onChange={(e) => handleAnswerChange(question.questionText, answer.text, e.target.checked)}
                                            className="answer-input"
                                            disabled={submitted}
                                            aria-label={`Select ${answer.text}`}
                                        />
                                    )}
                                    {answer.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                    {submitted && evaluation[question.questionText] && (
                        <div className="evaluation">
                            {evaluation[question.questionText].correct ? (
                                <p className="correct-answer">Correct!</p>
                            ) : (
                                <>
                                    <p className="incorrect-answer">Incorrect!</p>
                                    <p className="correct-answer">Correct answer(s): {evaluation[question.questionText].correctAnswers.join(", ")}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {submitted && (
                <div className="score-container">
                    <p>Your score: {score} out of {quiz.questions.reduce((total, question) => total + question.mark, 0)}</p>
                </div>
            )}
            <Link to={`/coursedetails/${quiz.courseId}`} className="back-button">Back to Course</Link>
            <button onClick={handleSubmit} disabled={submitting || submitted} className="submit-button">
                {submitting ? "Submitting..." : submitted ? "Submitted" : "Submit"}
            </button>
        </div>
    );
}

export default QuizAttemptPage;
