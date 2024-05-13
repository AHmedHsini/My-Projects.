import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


// Styled components for styling

const CategoryContainer = styled.div`
  margin-top: 6%;
  margin-left: 5%;
  max-width: 55%;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CourseCard = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 0px 0px 8px 8px; /* Note: Changed to regular CSS property syntax */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0px 4px rgba(0, 0, 0, 0.1); /* Adding an additional box shadow with less spread */
  position: fixed;
  right: 14%;
  top: 47%;
  width: 25.5%;
`;

const VideoList = styled.div`
  overflow-y: auto;
  max-height: 700px;
  margin-left: 5%;
`;

const VideoListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const QuizzesList = styled.div`
  width: 70%;
  margin-bottom: 16px;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const QuizItem = styled.div`
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const PdfList = styled.div`
  width: 70%;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PdfListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [files, setFiles] = useState({ PDF: [], VIDEO: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [userHasCardInfo, setUserHasCardInfo] = useState(false);
    const [confirmPurchase, setConfirmPurchase] = useState(false);
    const [userOwnsCourse, setUserOwnsCourse] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                // Fetch course details
                const courseResponse = await axios.get(`/api/Courses/${courseId}`);
                setCourse(courseResponse.data);

                // Fetch quizzes
                const quizzesResponse = await axios.get(`api/quiz/Courses/${courseId}`);
                setQuizzes(quizzesResponse.data);

                // Fetch files
                const filesResponse = await axios.get(
                    `/api/Courses/${courseId}/details`
                );
                setFiles(filesResponse.data);
            } catch (err) {
                setError("Failed to fetch course details");
                console.error("Failed to fetch course details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const checkUserCardInfo = async () => {
            if (user && user.id) {
                const response = await axios.get(
                    `/api/auth/user/${user.id}/has-card-info`
                );
                setUserHasCardInfo(response.data);
            }
        };
        if (user?.id) {
            checkUserCardInfo();
        }
    }, [user]);

    useEffect(() => {
        const checkCourseOwnership = async () => {
            try {
                if (user && user.id) {
                    const response = await axios.get(
                        `/api/Courses/${courseId}/check-purchase?userId=${user.id}`
                    );
                    setUserOwnsCourse(response.data.isPurchased);
                }
            } catch (error) {
                console.error("Error checking course ownership:", error);
            }
        };
        checkCourseOwnership();
    }, [courseId, user]);

    const handleBuyNow = () => {
        if (!userHasCardInfo) {
            setShowCardModal(true);
        } else {
            setConfirmPurchase(true);
        }
    };

    const handleCardSubmit = async (event) => {
        event.preventDefault();
        const cardNumber = event.target.cardNumber.value;
        const expiryDate = event.target.expiryDate.value;
        const cvv = event.target.cvv.value;

        try {
            if (user && user.id) {
                await axios.post(`/api/auth/user/${user.id}/card-info`, {
                    cardNumber,
                    expiryDate,
                    cvv,
                });
                setUserHasCardInfo(true);
                setShowCardModal(false);
                setConfirmPurchase(true);
            }
        } catch (error) {
            console.error("Failed to submit card information:", error);
        }
    };
    
    const confirmPurchaseHandler = async () => {
        try {
            const url = `/api/Courses/${courseId}/purchase?userId=${user.id}`;
            await axios.post(url);
            setConfirmPurchase(false);
            setUserOwnsCourse(true); // Update course ownership status
            alert("Purchase successful!");
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Purchase failed!");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    // Formatter to display the price in Tunisian Dinar (DT)
    const currencyFormatter = new Intl.NumberFormat("fr-TN", {
        style: "currency",
        currency: "TND",
        minimumFractionDigits: 2,
    });
    const formattedPrice = course ? currencyFormatter.format(course.price) : "";
    
    return (
        <div>
            <Header />

            <CategoryContainer className="p-4">
                <h3 className="text-xl font-bold text-indigo-600">Course Category</h3>
                <p className="text-gray-700">{course.category}</p>
            </CategoryContainer>

            <div style={{ borderRadius: "8px" }}>
                <img
                    src={course.courseImage}
                    alt={course.title}
                    style={{
                        float: "right",
                        marginRight: "14%",
                        width: "25.5%",
                        borderRadius: "8px",
                    }}
                />
                <CourseCard className="bg-white p-4">
                    <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{course?.description}</p>
                    <p className="text-gray-500 mb-4">Instructor: {course.instructor}</p>
                    {userOwnsCourse ? (
                        <p className="text-lg text-green-500 font-semibold">Owned</p>
                    ) : (
                        <div>
                            <p className="text-2xl font-bold mb-2">{formattedPrice}</p>
                            <button
                                onClick={handleBuyNow}
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    padding: "8px 24px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    float: "right",
                                    marginLeft: "10px",
                                }}
                            >
                                Buy Now
                            </button>
                        </div>
                    )}
                </CourseCard>

            </div>
            {/* Content Area */}
            
            <div className="w-3/5 p-6 ml-8">
                {/* Videos and Quizzes Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Videos Section */}
                    <VideoList className="rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-2">Videos</h3>
                        <ul>
                            {files?.VIDEO?.map((video, index) => (
                                <VideoListItem
                                    key={video.id ?? index}
                                    className="flex items-center mb-4"
                                >
                                    <div className="w-36 h-24 relative rounded-lg overflow-hidden mr-4">
                                        <video
                                            src={video.url}
                                            className="w-full h-full object-cover"
                                            onMouseEnter={(e) => {
                                                e.target.currentTime = 0;
                                                e.target.play().catch((error) => {
                                                    console.error("Failed to play video", error);
                                                });
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.pause();
                                                e.target.currentTime = 0;
                                            }}
                                            loop
                                        />
                                    </div>
                                    <div className="flex-grow ml-4">
                                        <div className="font-semibold">{video.title}</div>
                                        <div className="text-sm">{video.description}</div>
                                    </div>
                                </VideoListItem>
                            ))}
                        </ul>
                    </VideoList>

                    {/* Quizzes and PDF Files Section */}
                    <div>
                        {/* Quizzes Section */}
                        <QuizzesList className="rounded-lg p-4 mb-6">
                            <h3 className="text-xl font-bold mb-2">Quizzes</h3>
                            <ul>
                                {quizzes.map((quiz) => (
                                    <QuizItem
                                    key={quiz.id}
                                    className="mb-2"
                                    onClick={() => {
                                      if (userOwnsCourse) {
                                        navigate(`/api/quiz/${quiz.id}/attempt`);
                                      } else {
                                        // Handle condition when user does not own the course
                                        // You can show an error message or redirect to a different page
                                        console.log("User does not own the course");
                                        // Example: navigate('/error-page');
                                      }
                                    }}
                                  >
                                        <span>{quiz.title}</span>
                                    </QuizItem>
                                ))}
                            </ul>
                        </QuizzesList>
                        {/* PDF Files Section */}
                        <PdfList className="rounded-lg p-4">
                            <h3 className="text-xl font-bold mb-2">PDF Files</h3>
                            <ul>
                                {files?.PDF?.map((file, index) => (
                                    <PdfListItem
                                        key={file.id ?? index}
                                        className="flex items-center mb-4"
                                        onClick={() => window.open(file.url, "_blank")}
                                    >
                                        <FaFilePdf className="mr-2 text-red-500" size={20} />
                                        <span>{file.title}</span>
                                    </PdfListItem>
                                ))}
                            </ul>
                        </PdfList>
                    </div>
                </div>
            </div>

            {showCardModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
                            <form onSubmit={handleCardSubmit} className="space-y-6 p-6">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Card Number"
                                    className="w-full"
                                />
                                <input
                                    type="text"
                                    name="expiryDate"
                                    placeholder="Expiry Date"
                                    className="w-full"
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="CVV"
                                    className="w-full"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Submit
                                </button>
                            </form>
                            <div className="bg-gray-50 p-4 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => setShowCardModal(false)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {confirmPurchase && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
                            <div className="p-6">
                                <p className="text-lg font-semibold mb-4">Confirm Purchase</p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setConfirmPurchase(false)}
                                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmPurchaseHandler}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseDetails;
