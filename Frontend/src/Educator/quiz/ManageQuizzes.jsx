import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import QuizUpdateForm from './QuizUpdateForm'; // Import the QuizUpdateForm component
import NavBar from '../EducatorComponents/EducatorNavBar';


function ManageQuizzes() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingQuiz, setEditingQuiz] = useState(null); // State to manage the quiz being edited
    const { user } = useAuth(); // Use the useAuth hook to get the user object

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                setLoading(true);
                const response = await axios.get(`/api/quiz/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                setQuizzes(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.error('Failed to fetch quizzes');
            }
        }

        fetchQuizzes();
    }, [courseId, user?.token]);

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`/api/quiz/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
            toast.success('Quiz deleted successfully');
        } catch (error) {
            toast.error('Failed to delete quiz');
        }
    };

    const handleAddQuiz = () => {
        navigate(`/educator/${courseId}/create-quiz`);
    };

    // Function to handle editing quiz
    const handleEditQuiz = (quiz) => {
        setEditingQuiz(quiz); // Set the quiz being edited
    };

    return (
        <div>
            <NavBar />
        <div className="max-w-lg mx-auto"style={{marginTop:'50px'}}>
            <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
            {/* Add Quiz button */}
            <button
                onClick={handleAddQuiz}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add Quiz
            </button>

            {loading ? (
                <div className="text-center">
                    <p className="text-gray-500">Loading quizzes...</p>
                </div>
            ) : (
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} className="flex justify-between items-center mb-2 border-b py-2">
                            <span>{quiz.title}</span>
                            <div>
                                <button
                                    onClick={() => handleEditQuiz(quiz)}
                                    className="text-blue-500 hover:text-blue-700 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Show the QuizUpdateForm component if editingQuiz is not null */}
            {editingQuiz && (
                <QuizUpdateForm
                    quiz={editingQuiz}
                    onSave={(updatedQuiz) => {
                        // Handle the quiz update here
                        // Update the quiz in the state
                        setQuizzes((prevQuizzes) =>
                            prevQuizzes.map((quiz) =>
                                quiz.id === updatedQuiz.id ? updatedQuiz : quiz
                            )
                        );
                        setEditingQuiz(null); // Close the update form
                    }}
                    onCancel={() => setEditingQuiz(null)} // Close the update form
                />
            )}
        </div>
        </div>
    );
}

export default ManageQuizzes;
