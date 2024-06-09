import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/Courses/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError(error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        onCategorySelect(categoryName);
    };

    return (
        <div className="sidebar">
            <h2>Categories</h2>
            {error && <p className="error">Error fetching categories</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category.name} onClick={() => handleCategoryClick(category.name)}>
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
