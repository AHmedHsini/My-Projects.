import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaUpload } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';

function AddCourseModal({ isOpen, onClose, refreshCourses, isDarkMode }) {
    const { user } = useAuth();

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        categories: [],
    });

    const [courseImage, setCourseImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                const options = response.data.map(category => ({
                    value: category.id,
                    label: category.name,
                }));
                setCategoryOptions(options);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    const handleCategoryChange = (selectedOptions) => {
        setCourseData({
            ...courseData,
            categories: selectedOptions.map(option => option.value),
        });
    };

    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach((file) => {
                file.errors.forEach((err) => {
                    if (err.code === 'file-invalid-type') {
                        toast.error(`${file.file.name} is not a valid image file`);
                    }
                });
            });
            return;
        }

        const file = acceptedFiles[0];
        setCourseImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
        },
        maxFiles: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!courseData.title || !courseData.description || !courseData.price) {
            toast.error('Please fill out all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price);
        formData.append('categoryIds', courseData.categories.join(','));
        formData.append('type', 'IMAGE');

        if (courseImage) {
            formData.append('file', courseImage);
        }

        try {
            const response = await axios.post(
                `/api/Courses?educator=${user.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 201) {
                refreshCourses();
                toast.success('Course added successfully!');
                onClose();
            } else {
                throw new Error('Failed to add course.');
            }
        } catch (error) {
            console.error('Failed to add course:', error);
            toast.error('Failed to add course.');
        }
    };

    if (!isOpen) return null;

    const modalBgColor = isDarkMode ? 'bg-[#253237]' : 'bg-white';
    const modalTextColor = isDarkMode ? 'text-[#CAD2C5]' : 'text-gray-800';
    const inputBgColor = isDarkMode ? 'bg-[#1A2D34] text-white' : 'bg-white text-gray-800';
    const inputBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: isDarkMode ? '#1A2D34' : 'white',
            borderColor: isDarkMode ? 'gray' : '#d1d1d1',
            color: isDarkMode ? '#CAD2C5' : '#333',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDarkMode ? '#CAD2C5' : '#333',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDarkMode ? '#1A2D34' : 'white',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? isDarkMode
                    ? '#253237'
                    : '#ddd'
                : state.isFocused
                ? isDarkMode
                    ? '#2a3b45'
                    : '#eee'
                : isDarkMode
                ? '#1A2D34'
                : 'white',
            color: isDarkMode ? '#CAD2C5' : '#333',
        }),
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${modalBgColor}`}>
                <h1 className={`text-3xl font-bold text-center mb-8 ${modalTextColor}`}>Add a Course</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Course Title"
                        value={courseData.title}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${inputBgColor} ${inputBorderColor}`}
                    />

                    <textarea
                        name="description"
                        placeholder="Course Description"
                        value={courseData.description}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${inputBgColor} ${inputBorderColor}`}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Course Price"
                        value={courseData.price}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${inputBgColor} ${inputBorderColor}`}
                    />

                    <div>
                        <label className={`block mb-2 ${modalTextColor}`}>Course Category:</label>
                        <Select
                            isMulti
                            name="categories"
                            options={categoryOptions}
                            value={categoryOptions.filter(option => courseData.categories.includes(option.value))}
                            onChange={handleCategoryChange}
                            styles={customStyles}
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className={`block mb-2 ${modalTextColor}`}>Course Image:</label>
                        <div {...getRootProps()} className={`border-dashed border-2 p-4 text-center cursor-pointer ${inputBorderColor} ${inputBgColor}`}>
                            <input {...getInputProps()} />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Course Preview" className="w-full h-auto" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <FaUpload className="text-4xl mb-2" />
                                    <p>Drag & drop an image here, or click to select one</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                        <FaSave className="mr-2" /> Add Course
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default AddCourseModal;
