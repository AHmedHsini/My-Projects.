import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../EducatorComponents/EducatorNavBar';
import { FaPen } from 'react-icons/fa';

function EditCourse() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [courseImage, setCourseImage] = useState(null);
    const [description, setDescription] = useState('');
    const [courseImageUrl, setCourseImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = response.data;
                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setSelectedCategories(data.categories.map(cat => ({ value: cat.id, label: cat.name })));
                setCourseImageUrl(data.courseImage || '');
                setIsLoading(false);
            } catch (error) {
                toast.error('Failed to fetch course details');
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data.map(cat => ({ value: cat.id, label: cat.name })));
            } catch (error) {
                toast.error('Failed to fetch categories');
            }
        };

        fetchCourse();
        fetchCategories();
    }, [courseId, user]);

    const handleUpdateCourse = async (e) => {
        e.preventDefault();

        const courseData = {
            id: courseId,
            title: title,
            price: price,
            description: description
        };

        const formData = new FormData();
    
        formData.append('cours', JSON.stringify(courseData));
    
        if (courseImage) {
            formData.append('file', courseImage);
        }
    
        formData.append('educator', user.id);
    
        // Append each category ID separately
        selectedCategories.forEach(cat => formData.append('categoryIds', cat.value));
    
        try {
            const response = await axios.put(`/api/Courses`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Course updated successfully');
            navigate(`/educator/course/${courseId}`);
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setCourseImage(selectedFile);
            setCourseImageUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4 max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
                <div className="bg-gray-100 p-6 shadow-lg rounded-lg">
                    <form onSubmit={handleUpdateCourse} className="w-full">
                        <div className="mb-4 text-center relative w-full">
                            {courseImageUrl && (
                                <div className="relative inline-block w-1/2">
                                    <img src={courseImageUrl} alt="Course" className="mt-2 w-full mx-auto rounded" />
                                    <label htmlFor="courseImage" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded">
                                        <FaPen className="text-white text-2xl" />
                                    </label>
                                    <input
                                        type="file"
                                        id="courseImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="title" className="block font-medium mb-2">Title:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="price" className="block font-medium mb-2">Price:</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="category" className="block font-medium mb-2">Category:</label>
                            <Select
                                isMulti
                                value={selectedCategories}
                                onChange={handleCategoryChange}
                                options={categories}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="description" className="block font-medium mb-2">Description:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="4"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Update Course</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;
