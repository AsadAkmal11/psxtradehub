import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./menu.css";

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleMinimized = () => {
        setMinimized(!minimized);
        if (!minimized) {
            setMaximized(false); // If minimizing, always unmaximize
        }
    };
    const handleMaximized = () => {
        if (!maximized) {
            setMinimized(false); // If maximizing, always unminimize
        }
        setMaximized(!maximized);
    };
    const handleClose = () => {
        setOpen(false);
        setMaximized(false);
        setMinimized(false);
    };

    // Minimize icon: horizontal line (SVG)
    const MinimizeIcon = () => (
        <svg width="18" height="18" viewBox="0 0 18 18"><rect x="4" y="13" width="10" height="2" rx="1" fill="currentColor"/></svg>
    );
    // Maximize icon: square (SVG)
    const MaximizeIcon = () => (
        <svg width="18" height="18" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
    );
    // Close icon: X (SVG)
    const CloseIcon = () => (
        <svg width="18" height="18" viewBox="0 0 18 18"><line x1="5" y1="5" x2="13" y2="13" stroke="currentColor" strokeWidth="2"/><line x1="13" y1="5" x2="5" y2="13" stroke="currentColor" strokeWidth="2"/></svg>
    );

    return (
        <>
            <div className="hamburger-icon themed-hamburger left" onClick={() => setOpen(true)}>
                <FaBars size={28} color="#F0B90B" />
            </div>
            {open && (
                <div
                    className={`overlay-panel themed-overlay menu-transition ${
                        minimized ? "minimized" : maximized ? "maximized" : "compact"
                    }`}
                >
                    <div className="overlay-header themed-header">
                        <span className="overlay-title themed-title">Menu</span>
                        <div className="window-controls">
                            <button onClick={handleMinimized} title="Minimize" className="window-btn minimize-btn">
                                <MinimizeIcon />
                            </button>
                            <button onClick={handleMaximized} title="Maximize" className="window-btn maximize-btn">
                                <MaximizeIcon />
                            </button>
                            <button onClick={handleClose} title="Close" className="window-btn close-btn">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                    {!minimized && (
                        <nav className="overlay-nav themed-nav">
                            {user && user.role === 'admin' && (
                                <Link to="/upload" onClick={handleClose}>Stock Upload</Link>
                            )}
                            <Link to="/marketwatch" onClick={handleClose}>Market Watch</Link>
                            <Link to="/customer-portfolio" onClick={handleClose}>Customer/Portfolio</Link>
                            <Link to="/watchlist" onClick={handleClose}>Watchlist</Link>
                        </nav>
                    )}
                </div>
            )}
        </>
    );
};
export default Menu;