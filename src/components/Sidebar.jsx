import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHeartbeat,
    FaMicrophone,
    FaLaptopMedical,
    FaHospitalAlt
} from 'react-icons/fa';
import './Sidebar.css';

const navItems = [
    { path: '/triage', icon: <FaHeartbeat />, label: 'Smart Triage', subtitle: 'ER Module' },
    { path: '/scribe', icon: <FaMicrophone />, label: 'Ambient Scribe', subtitle: 'Consultation' },
    { path: '/monitor', icon: <FaLaptopMedical />, label: 'Digital Caretaker', subtitle: 'Home Monitor' },
];

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <FaHospitalAlt />
                </div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">AI Care</span>
                    <span className="sidebar-brand-sub">Smart Hospital</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-nav-label">MODULES</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <div className="sidebar-link-text">
                            <span className="sidebar-link-label">{item.label}</span>
                            <span className="sidebar-link-sub">{item.subtitle}</span>
                        </div>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-status">
                    <span className="sidebar-status-dot"></span>
                    <span className="sidebar-status-text">System Online</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
