import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/EducatorComponents/EducatorNavBar';
import { FaPen } from 'react-icons/fa';

function EditCourse() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
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

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const coursData = {
            id: courseId,
            title,
            price,
            category,
            description,
        };

        formData.append('cours', JSON.stringify(coursData));

        if (courseImage) {
            formData.append('file', courseImage);
        }

        formData.append('educator', user.id);

        try {
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

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setCourseImage(selectedFile);
            setCourseImageUrl(URL.createObjectURL(selectedFile));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
                <form onSubmit={handleUpdateCourse} className="w-full">
                    <div className="mb-4 text-center relative w-full">
                        {courseImageUrl && (
                            <div className="relative inline-block w-full">
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
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border rounded"
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
    );
}

export default EditCourse;
