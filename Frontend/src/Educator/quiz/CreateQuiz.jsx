import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // Import the useAuth hook

function CreateQuizForm() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const { courseId } = useParams();

    // Use the useAuth hook to get the user object
    const { user } = useAuth();

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', answers: [] }]);
    };

    const handleAddAnswer = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers.push({ text: '', isCorrect: false });
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, questionText) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = questionText;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].text = text;
        setQuestions(updatedQuestions);
    };

    const handleAnswerCorrectChange = (questionIndex, answerIndex, isCorrect) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex].isCorrect = isCorrect;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is available
        if (!user) {
            toast.error('User is not authenticated');
            return;
        }

        const quizData = {
            title,
            questions,
            courseId,
        };

        try {
            await axios.post(`/api/quiz`, quizData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            toast.success('Quiz created successfully!');
            navigate(`/educator/course/${courseId}`);
        } catch (error) {
            console.error('Error creating quiz:', error);
            toast.error('Failed to create quiz');
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Quiz Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                {questions.map((question, index) => (
                    <div key={index} className="mb-4">
                        <div className="mb-2">
                            <label className="block text-gray-700">Question {index + 1}</label>
                            <input
                                type="text"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) =>
                                        handleAnswerChange(index, answerIndex, e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="Answer text"
                                    required
                                />
                                <label className="ml-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={answer.isCorrect}
                                        onChange={(e) =>
                                            handleAnswerCorrectChange(index, answerIndex, e.target.checked)
                                        }
                                        className="mr-2"
                                    />
                                    Correct
                                </label>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddAnswer(index)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Add Answer
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="mb-4 text-blue-500 hover:text-blue-700"
                >
                    Add Question
                </button>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
                    Create Quiz
                </button>
            </form>
        </div>
    );
}

export default CreateQuizForm;
