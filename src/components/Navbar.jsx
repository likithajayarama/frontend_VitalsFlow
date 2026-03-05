import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-title">
                <h2>AI Care Dashboard</h2>
                <span className="navbar-subtitle">Smart Hospital Assistant</span>
            </div>

            <div className="navbar-actions">
                <button className="navbar-icon-btn" title="Notifications">
                    <FaBell />
                    <span className="navbar-badge">3</span>
                </button>
                <div className="navbar-divider"></div>
                <div className="navbar-user">
                    <FaUserCircle className="navbar-avatar" />
                    <div className="navbar-user-info">
                        <span className="navbar-user-name">Dr. Admin</span>
                        <span className="navbar-user-role">Physician</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
