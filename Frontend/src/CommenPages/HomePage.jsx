import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "./headerComponents/Header";
import Footer from "./footerComponents/Footer";
import LoginPopup from './AuthPages/LoginPage'; // Import the LoginPopup component
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [canScrollLeftCategory, setCanScrollLeftCategory] = useState(false);
  const [canScrollRightCategory, setCanScrollRightCategory] = useState(true);
  const [canScrollLeftCourse, setCanScrollLeftCourse] = useState(false);
  const [canScrollRightCourse, setCanScrollRightCourse] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State to manage login popup visibility
  const navigate = useNavigate();
  const courseContainerRef = useRef(null);
  const categoryContainerRef = useRef(null);
  const location = useLocation();

  // Track initial mount
  const isInitialMount = useRef(true);

  // Placeholder conversion rate; replace with actual rate
  const conversionRate = 2.8;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      logPageVisit();
      fetchCategories();
    }
    // Check if we need to show the login popup
    if (location.state && location.state.showLoginPopup) {
      setShowLoginPopup(true);
    }
  }, [location]);

  const logPageVisit = async () => {
    try {
      await axios.get("/api/activity/log/visit");
    } catch (error) {
      console.error("Failed to log page visit:", error);
    }
  };

  useEffect(() => {
    if (categoryContainerRef.current) {
      checkScrollPositionCategory();
      const ref = categoryContainerRef.current;
      ref.addEventListener("scroll", checkScrollPositionCategory);
      return () => {
        ref.removeEventListener("scroll", checkScrollPositionCategory);
      };
    }
  }, [categories]);

  useEffect(() => {
    if (courseContainerRef.current) {
      checkScrollPositionCourse();
      const ref = courseContainerRef.current;
      ref.addEventListener("scroll", checkScrollPositionCourse);
      return () => {
        ref.removeEventListener("scroll", checkScrollPositionCourse);
      };
    }
  }, [categoryPreview]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
      setSelectedCategory(response.data[0].id);
      fetchCategoryPreview(response.data[0].id);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCategoryPreview = async (categoryId) => {
    try {
      const response = await axios.get(`/api/Courses/category/${categoryId}`);
      setCategoryPreview(response.data);
    } catch (error) {
      console.error("Failed to fetch category preview:", error);
    }
  };

  const handleCourseClick = async (courseId) => {
    try {
      await axios.put(`/api/Courses/${courseId}/increment-visit`);
      navigate(`/coursedetails/${courseId}`);
    } catch (error) {
      console.error("Failed to increment course visit count:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchCategoryPreview(categoryId);
  };

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -900, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 900, behavior: "smooth" });
  };

  const checkScrollPositionCategory = () => {
    const { scrollLeft, scrollWidth, clientWidth } = categoryContainerRef.current;
    setCanScrollLeftCategory(scrollLeft > 0);
    setCanScrollRightCategory(scrollLeft + clientWidth < scrollWidth);
  };

  const checkScrollPositionCourse = () => {
    const { scrollLeft, scrollWidth, clientWidth } = courseContainerRef.current;
    setCanScrollLeftCourse(scrollLeft > 0);
    setCanScrollRightCourse(scrollLeft + clientWidth < scrollWidth);
  };

  const currencyFormatter = new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 2,
  });

  return (
    <div>
      <Header />
      <section
        style={{
          backgroundImage: 'url("../assets/images/banner.png")',
          width: "100%",
          height: "800px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "1.75%",
          position: "relative",
        }}
      >
        <img
          src="../assets/images/b1.png"
          alt="Banner"
          style={{
            position: "absolute",
            top: "52%",
            right: "15%",
            transform: "translateY(-50%)",
            width: "80%",
            height: "auto",
            maxWidth: "580px",
            marginRight: "5%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "49%",
            left: "15%",
            transform: "translateY(-50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <h2 style={{ 
            fontSize: "28px", 
            color: "#333", 
            fontWeight: "bold",
            lineHeight: "1.4",
          }}>
            "Empower Your Future with Our Courses!"
          </h2>
        </div>

        <img
          src="../assets/images/book.png"
          alt="Banner"
          style={{
            position: "absolute",
            top: "62%",
            left: "16%",
            display: "flex",
            width: "auto",
            height: "auto",
          }}
        />
      </section>

      <div className="container mx-auto p-8">
        <div className="relative mb-8 group">
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .category-container {
              display: flex;
              overflow-x: auto;
              white-space: nowrap;
              padding: 10px 0;
              position: relative;
            }
            .category-container::-webkit-scrollbar {
              display: none;
            }
            .category-container span {
              padding: 10px 15px;
              cursor: pointer;
              position: relative;
            }
            .category-container span.selected::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              background-color: #000;
            }
          `}</style>
          {canScrollLeftCategory && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scrollLeft(categoryContainerRef)}
            >
              <FaArrowLeft />
            </button>
          )}
          <div
            ref={categoryContainerRef}
            className="category-container no-scrollbar"
          >
            {categories.map((category) => (
              <span
                key={category.id}
                className={`${selectedCategory === category.id ? 'selected text-black font-bold' : 'text-gray-500'} hover:text-gray-800 transition`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          {canScrollRightCategory && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scrollRight(categoryContainerRef)}
            >
              <FaArrowRight />
            </button>
          )}
        </div>

        <div className="category-preview mb-8 relative group">
          {canScrollLeftCourse && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scrollLeft(courseContainerRef)}
            >
              <FaArrowLeft />
            </button>
          )}
          <div
            ref={courseContainerRef}
            className="flex overflow-x-auto space-x-4 no-scrollbar"
            style={{
              height: 'auto',
              paddingBottom: '16px',
            }}
          >
            {categoryPreview.length > 0 ? (
              categoryPreview.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg shadow-lg transition transform hover:scale-105"
                  onClick={() => handleCourseClick(course.id)}
                  style={{ cursor: "pointer", width: "270px", flex: "0 0 auto" }}
                >
                  {course.courseImage && (
                    <img
                      src={course.courseImage}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1" style={{ lineHeight: '1.5' }}>
                    {course.description.split(' ').slice(0, 20).join(' ')}...
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-yellow-500 font-bold">
                      {course.rating} ⭐
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {currencyFormatter.format(course.price * conversionRate)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No courses available</p>
            )}
          </div>
          {canScrollRightCourse && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scrollRight(courseContainerRef)}
            >
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
      <Footer />
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />} {/* Render the LoginPopup if showLoginPopup is true */}
    </div>
  );
}

export default HomePage;
