import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const sidebarStyles = {
    width: '250px',
    backgroundColor: '#0047ab',
    padding: '20px',
    color: '#fff'
};

const titleStyles = {
    marginBottom: '20px',
    textAlign: 'center'
};

const linkStyles = {
    textDecoration: 'none',
    color: '#fff',
    display: 'block',
    padding: '10px 16px',
    borderRadius: '4px'
};

const activeStyles = {
    backgroundColor: '#003080'
};

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/'); 
    };

    return (
        <div className="sidebar" style={sidebarStyles}>
            <h2 className="sidebar-title" style={titleStyles}>Welcome Admin!</h2>
            <ul className="sidebar-menu" style={{ listStyleType: 'none', padding: 0 }}>
                <li className="sidebar-menu-item">
                    <Link to="/admin" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin' && activeStyles) }}>
                        Dashboard
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <Link to="/admin/educators" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin/educators' && activeStyles) }}>
                        Educators
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <Link to="/admin/students" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin/students' && activeStyles) }}>
                        Students
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <Link to="/admin/reports" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin/reports' && activeStyles) }}>
                        Reports
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <Link to="/admin/add-category" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin/add-category' && activeStyles) }}>
                        Manage Category
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <Link to="/admin/purchase-history" className="sidebar-link" style={{ ...linkStyles, ...(location.pathname === '/admin/purchase-history' && activeStyles) }}>
                        All Purchase Histories
                    </Link>
                </li>
                <li className="sidebar-menu-item">
                    <a href="/" className="sidebar-link" style={linkStyles} onClick={handleLogout}>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
