import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        const fetchCategoriesAndCourses = async () => {
            try {
                const response = await axios.get('/api/admin/categories-with-course-counts');
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to fetch categories. Please try again later.');
                setLoading(false);
            }
        };
    
        fetchCategoriesAndCourses();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();

        if (!newCategory) {
            setError('Category name is required');
            return;
        }

        try {
            const response = await axios.post('/api/admin/categories', {
                name: newCategory,
                description: newDescription,
            });
            setCategories([...categories, response.data]);
            setNewCategory('');
            setNewDescription('');
            setError(null);
            setModalIsOpen(false);
        } catch (error) {
            console.error('Failed to add category:', error);
            setError('Failed to add category. Please try again later.');
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            await axios.delete(`/api/admin/categories/${categoryToDelete.id}`);
            setCategories(categories.filter(category => category.id !== categoryToDelete.id));
            setDeleteModalIsOpen(false);
        } catch (error) {
            console.error('Failed to delete category:', error);
            setError('Failed to delete category. Please try again later.');
        }
    };

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setDeleteModalIsOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-200">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-center text-gray-800">Manage Categories</h1>
                    <button 
                        onClick={() => setModalIsOpen(true)} 
                        className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 flex items-center justify-center relative"
                    >
                        <FaPlus className="text-white" />
                        <span className="absolute bottom-0 transform translate-y-full bg-gray-700 text-white text-xs rounded p-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            Add Category
                        </span>
                    </button>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow mb-4 h-[50rem] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Existing Categories</h2>
                        <ul>
                            {categories.map((category, index) => (
                                <li key={index} className="border-b py-2 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold">{category.name}</h3>
                                        <p className="text-gray-500">{category.description}</p>
                                        <p className="text-gray-500">Courses: {category.numberOfCourses}</p>
                                    </div>
                                    <button 
                                        onClick={() => openDeleteModal(category)} 
                                        className="text-red-500 px-4 py-2 rounded hover:text-red-600 flex items-center"
                                    >
                                        <FaTrash className="text-red-500" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Add Category"
                    className="modal bg-white rounded p-8 max-w-lg mx-auto mt-20"
                    overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50"
                >
                    <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
                    <form onSubmit={handleAddCategory}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Category Name</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Category
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                </Modal>
                <Modal
                    isOpen={deleteModalIsOpen}
                    onRequestClose={() => setDeleteModalIsOpen(false)}
                    contentLabel="Delete Confirmation"
                    className="modal bg-white rounded p-8 max-w-lg mx-auto mt-20"
                    overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50"
                >
                    <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                    <p>Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDeleteCategory}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setDeleteModalIsOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AdminCategories;
