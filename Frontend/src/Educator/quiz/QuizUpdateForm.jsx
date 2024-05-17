import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/EducatorComponents/EducatorNavBar';


function QuizUpdateForm({ quiz, onSave, onCancel }) {
    const { user } = useAuth();
    const [title, setTitle] = useState(quiz.title);
    const [questions, setQuestions] = useState(quiz.questions || []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedQuiz = {
            ...quiz,
            title,
            questions,
        };

        try {
            const response = await axios.put(`/api/quiz/${quiz.id}`, updatedQuiz, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            onSave(response.data);
            toast.success('Quiz updated successfully');
        } catch (error) {
            toast.error('Failed to update quiz');
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        const updatedQuestions = [...questions];
        const updatedAnswers = updatedQuestions[questionIndex].answers.map((answer, idx) => {
            if (idx === answerIndex) {
                return {
                    ...answer,
                    [field]: value,
                };
            }
            return answer;
        });

        updatedQuestions[questionIndex].answers = updatedAnswers;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                answers: [{ text: '', correct: false }],
            },
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, idx) => idx !== index));
    };

    const addAnswer = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers.push({ text: '', correct: false });
        setQuestions(updatedQuestions);
    };

    const removeAnswer = (questionIndex, answerIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter((_, idx) => idx !== answerIndex);
        setQuestions(updatedQuestions);
    };

    return (
        <div><NavBar />
        <div className="p-4 border bg-gray-100 rounded">
            <h3 className="text-xl font-bold mb-2">Edit Quiz</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex} className="mb-4">
                            <input
                                type="text"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                            <div>
                                {question.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={answer.text}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={answer.correct}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, 'correct', e.target.checked)}
                                            className="ml-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(qIndex, aIndex)}
                                            className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addAnswer(qIndex)}
                                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    Add Answer
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        Add Question
                    </button>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default QuizUpdateForm;
