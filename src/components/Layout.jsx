import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="app-layout">
            <div className="app-sidebar">
                <Sidebar />
            </div>
            <div className="app-body">
                <div className="app-navbar">
                    <Navbar />
                </div>
                <main className="app-content">
                    <Outlet />
                </main>
                <div className="app-footer">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Layout;
