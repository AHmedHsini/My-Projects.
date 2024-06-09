import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Ensure correct path
import RegisterPage from './CommenPages/AuthPages/RegisterPage';
import LoginPage from './CommenPages/AuthPages/LoginPage';
import AdminPage from './Admin/AdminPage';
import HomePage from './CommenPages/HomePage';
import EducatorPage from './Educator/EducatorPage';
import ProfilePage from './CommenPages/ProfilePage';
import AddCourseForm from './Educator/course/CreateCourse';
import ViewCourse from './Educator/course/CoursePage';
import EditCourse from './Educator/course/EditCourse';
import CreateQuizForm from './Educator/quiz/CreateQuiz';
import ManageQuizzes from './Educator/quiz/ManageQuizzes';
import { DarkModeProvider } from './contexts/DarkMode';
import UploadFile from './Educator/course/UploadFile';
import CourseDetails from './CommenPages/CourseDetailsPage/CourseDetails';
import PasswordReset from './CommenPages/Security/PasswordReset';
import AttemptQuiz from './StudentPage/QuizAttemptPage';
import EducatorsPage from "./Admin/EducatorsPage";
import StudentsPage from "./Admin/StudentsPage";
import StudentDetails from './Admin/StudentDetails';
import SearchResultPage from './CommenPages/SearchResultPage';
import EducatorDetails from './Admin/EducatorDetails';
import EmailVerification from './CommenPages/Security/EmailVerification';
import EditProfile from './CommenPages/ProfileComponents/EditProfile';
import MyCourses from './StudentPage/MyCourses ';
import PurchaseHistory from './StudentPage/PurchaseHistory';
import AdminPurchaseHistory from './Admin/AdminPurchaseHistory';
import AddCategory from './Admin/AddCategory';
import VideoPage from './CommenPages/videospage/VideoPage';
import ReportsPage from './Admin/ReportsPage';

// Set the base URL for all Axios requests
axios.defaults.baseURL = 'http://localhost:8080'; // Replace 'http://localhost:8080' with your backend server URL

function App() {
    return (
        <AuthProvider> {/* This ensures that all routes have access to the AuthContext */}
            <DarkModeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/email-verification/:token" element={<EmailVerification />} />
                        

                        
                        <Route path="/reset-password/:token" element={<PasswordReset />} />
                        <Route path="/search-results" element={<SearchResultPage />} />

                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/educators" element={<EducatorsPage />} />
                        <Route path="/admin/students" element={<StudentsPage />} />
                        <Route path="/StudentDetails/:userId" element={<StudentDetails />} />
                        <Route path="/EducatorDetails/:userId" element={<EducatorDetails />} />
                        <Route path="/admin/add-category" element={<AddCategory />} />
                        <Route path="/admin/purchase-history" element={<AdminPurchaseHistory />} />
                        <Route path="/admin/reports" element={<ReportsPage />} /> 
                        
                        <Route path="/educator" element={<EducatorPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        <Route path="/educator/add-course" element={<AddCourseForm />} />
                        <Route path="/educator/course/:courseId" element={<ViewCourse />} />
                        <Route path="/educator/:courseId/edit" element={<EditCourse />} />

                        <Route path="/educator/:courseId/create-quiz" element={<CreateQuizForm />} />
                        <Route path="/educator/:courseId/manage-quizzes" element={<ManageQuizzes />} />

                        <Route path="/educator/:courseId/add-file" element={<UploadFile />} />

                        <Route path="/coursedetails/:courseId" element={<CourseDetails />} />
                        <Route path="/api/quiz/:quizId/attempt" element={<AttemptQuiz />} />
                        <Route path="/my-courses" element={<MyCourses />} />
                        <Route path="/purchase-history" element={<PurchaseHistory />} />
                        <Route path="/video/:videoId" element={<VideoPage />} />
                    
                    </Routes>
                </Router>
            </DarkModeProvider>
        </AuthProvider>
    );
}

export default App;
