import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuizAttemptPage.css"; // Make sure to update the path if necessary

function QuizAttemptPage() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await axios.get(`/api/quiz/${quizId}`);
                setQuiz(response.data);
            } catch (error) {
                console.error("Failed to fetch quiz details:", error);
                setError("Failed to load quiz. Please try again later.");
            }
        };
        fetchQuizDetails();
    }, [quizId]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmit = async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            await axios.post(`/api/quiz/${quizId}/attempt`, {
                userId: "user_id_here", // Ensure to replace with actual user ID from context or props
                providedAnswers: Object.entries(answers).map(([questionId, selectedOption]) => ({
                    questionId,
                    selectedOption,
                })),
            });
            // Add navigation or success message here
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            setError("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
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
                                    <input
                                        type="radio"
                                        value={answer.text}
                                        checked={answers[question.questionText] === answer.text}
                                        onChange={() => handleAnswerChange(question.questionText, answer.text)}
                                        className="answer-input"
                                        aria-label={`Choose ${answer.text}`}
                                    />
                                    {answer.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button onClick={handleSubmit} disabled={submitting} className="submit-button">
                {submitting ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
}

export default QuizAttemptPage;
