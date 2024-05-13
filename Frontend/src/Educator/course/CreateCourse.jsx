import React, { useState } from 'react';
import axios from 'axios';
import { FaSave } from 'react-icons/fa';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/EducatorComponents/EducatorNavBar';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth from your AuthProvider file

function AddCourseForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); // Access user using useAuth

    // Get refreshCourses from location state or use a no-op function
    const { refreshCourses = () => { } } = location.state || {};

    // Initialize course data state
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        category: [],
    });

    // Initialize course image state and image preview state
    const [courseImage, setCourseImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Define category options for the select input
    const categoryOptions = [
        { value: 'DEVELOPMENT', label: 'Development' },
        { value: 'BUSINESS', label: 'Business' },
        { value: 'IT_AND_SOFTWARE', label: 'IT and Software' },
        { value: 'OFFICE_PRODUCTIVITY', label: 'Office Productivity' },
        { value: 'PERSONAL_DEVELOPMENT', label: 'Personal Development' },
        { value: 'DESIGN', label: 'Design' },
        { value: 'MARKETING', label: 'Marketing' },
        { value: 'LIFESTYLE', label: 'Lifestyle' },
        { value: 'PHOTOGRAPHY_AND_VIDEO', label: 'Photography and Video' },
        { value: 'HEALTH_AND_FITNESS', label: 'Health and Fitness' },
        { value: 'TEACHING_AND_ACADEMICS', label: 'Teaching and Academics' },
    ];

    // Handle input changes for the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    // Handle category selection changes
    const handleCategoryChange = (selectedOptions) => {
        setCourseData({
            ...courseData,
            category: selectedOptions.map(option => option.value),
        });
    };

    // Handle image file selection and create an image preview URL
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setCourseImage(selectedFile);

        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImagePreview(imageUrl);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required form data
        if (!courseData.title || !courseData.description || !courseData.price) {
            toast.error('Please fill out all required fields.');
            return;
        }

        // Create FormData object and append course data and image file
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price);
        formData.append('category', courseData.category.join(','));
        formData.append('type', 'IMAGE'); // Include the 'type' parameter

        // Append the selected course image file
        if (courseImage) {
            formData.append('file', courseImage);
        }

        try {
            const response = await axios.post(
                `/api/Courses?educator=${user.id}`, // Use user from useAuth
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // If the response is successful, refresh courses and navigate
            if (response.status === 201) {
                refreshCourses();
                toast.success('Course added successfully!');
                navigate('/educator');
            } else {
                throw new Error('Failed to add course.');
            }
        } catch (error) {
            console.error('Failed to add course:', error);
            toast.error('Failed to add course.');
        }
    };


    // Render the form
    return (
        <div>
            <NavBar />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add a Course</h1>

                    {/* Course title input */}
                    <input
                        type="text"
                        name="title"
                        placeholder="Course Title"
                        value={courseData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* Course description textarea */}
                    <textarea
                        name="description"
                        placeholder="Course Description"
                        value={courseData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* Course price input */}
                    <input
                        type="number"
                        name="price"
                        placeholder="Course Price"
                        value={courseData.price}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* Course category select input */}
                    <div className="mb-4">
                        <label className="block text-gray-800 mb-2">Course Category:</label>
                        <Select
                            isMulti
                            name="category"
                            options={categoryOptions}
                            value={categoryOptions.filter(option => courseData.category.includes(option.value))}
                            onChange={handleCategoryChange}
                            className="w-full"
                        />
                    </div>

                    {/* Course image input */}
                    <div className="mb-4">
                        <label className="block text-gray-800 mb-2" htmlFor="image">Course Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img src={imagePreview} alt="Course Preview" className="w-full h-auto" />
                            </div>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                        <FaSave className="mr-2" /> Add Course
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCourseForm;
