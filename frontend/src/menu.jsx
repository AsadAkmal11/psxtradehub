import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./menu.css";

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const handleMinimized = () => setMinimized(!minimized);
    const handleMaximized = () => setMaximized(!maximized);
    const handleClose = () => {
        setOpen(false);
        setMaximized(false);
        setMinimized(false);
    };
    return (
        <>
            <div className="hamburger-icon left" onClick={() => setOpen(true)}>
                <FaBars size={28} />
            </div>
            {open && (
                <div className={`overlay-panel${maximized ? " maximized" : ""}${minimized ? " minimized" : " compact"}`}>
                    <div className="overlay-header">
                        <span className="overlay-title">Menu</span>
                        <div className="window-controls">
                            <button onClick={handleMinimized} title="Minimize" className="window-btn">-</button>
                            <button onClick={handleMaximized} title="Maximize" className="window-btn">▢</button>
                            <button onClick={handleClose} title="Close" className="window-btn">×</button>
                        </div>
                    </div>
                    {!minimized && (
                        <nav className="overlay-nav">
                            {user && user.role === 'admin' && (
                            <Link to="/upload" onClick={handleClose}>Stock Upload</Link>
                            )}
                            <Link to="/marketwatch" onClick={handleClose}>Market Watch</Link>
                            <Link to="/customer-portfolio" onClick={handleClose}>Customer/Portfolio</Link>
                        </nav>
                    )}
                </div>
            )}
        </>
    );
};
export default Menu;