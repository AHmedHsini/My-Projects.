import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/EducatorComponents/EducatorNavBar';


function EditCourse() {
    // Retrieve courseId from URL parameters and user context
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State variables to hold course details and loading status
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [courseImage, setCourseImage] = useState(null);
    const [description, setDescription] = useState('');
    const [courseImageUrl, setCourseImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch course details on component mount
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Make a GET request to fetch course details
                const response = await axios.get(`/api/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = response.data;
                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category || '');
                setCourseImageUrl(data.courseImage || '');
                setIsLoading(false);
            } catch (error) {
                toast.error('Failed to fetch course details');
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, user]);

    // Handle course update form submission
    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Create an object with the course data
        const coursData = {
            id: courseId,
            title,
            price,
            category,
            description,
        };

        // Add the course data as a JSON string to the FormData object
        formData.append('cours', JSON.stringify(coursData));

        // Add the course image file if provided
        if (courseImage) {
            formData.append('file', courseImage);
        }

        // Pass only the educator's ID
        formData.append('educator', user.id);

        try {
            // Send the PUT request to update the course
            await axios.put(`/api/Courses`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Course updated successfully');
            navigate(`/educator/course/${courseId}`);
        } catch (error) {
            toast.error('Failed to update course');
        }
    };


    // Handle course image file change
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setCourseImage(selectedFile);
        setCourseImageUrl(URL.createObjectURL(selectedFile));
    };

    // Display loading spinner while fetching course details
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Render the EditCourse form
    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
                <form onSubmit={handleUpdateCourse}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block font-medium mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block font-medium mb-2">Price:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block font-medium mb-2">Category:</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="courseImage" className="block font-medium mb-2">Course Image:</label>
                        <input
                            type="file"
                            id="courseImage"
                            onChange={handleImageChange}
                            className="w-full p-2 border rounded"
                        />
                        {courseImageUrl && (
                            <img src={courseImageUrl} alt="Course" className="mt-2 w-32" />
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-medium mb-2">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update Course</button>
                </form>
            </div>
        </div>
    );
}

export default EditCourse;
