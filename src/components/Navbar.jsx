import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { isMobileDevice } from '../utils/walletUtils';

const Navbar = (props) => {
    const [navbarState, setNavbarState] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navbarRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        // Detect if we're on a mobile device
        setIsMobile(isMobileDevice());
        
        const navbar = navbarRef.current;
        let lastScroll = 0;

        // Handle scroll behavior
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                document.body.classList.remove("scroll-down");
                navbar.classList.remove("grey-nav");
            }

            if (currentScroll > lastScroll && !document.body.classList.contains("scroll-down")) {
                document.body.classList.add("scroll-down");
                navbar.classList.add("grey-nav");
            }

            if (currentScroll < lastScroll && document.body.classList.contains("scroll-down")) {
                document.body.classList.remove("scroll-down");
            }

            lastScroll = currentScroll;
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);
        
        // Handle clicks outside the mobile menu to close it
        const handleClickOutside = (event) => {
            if (navbarState && 
                mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target) && 
                !navbarRef.current.contains(event.target)) {
                setNavbarState(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        // Clean up the event listeners on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [navbarState]);

    // Close mobile menu when a link is clicked
    const closeMenu = () => {
        setNavbarState(false);
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setNavbarState(!navbarState);
    };

    return (
        <>
            <nav id="navbar" ref={navbarRef} className={isMobile ? "mobile-navbar" : ""}>
                <div className="logo">
                    <Link to="/">
                        <h1>ChainElect</h1>
                    </Link>
                </div>
                
                {/* Desktop menu */}
                <ul className={isMobile ? "nav desktop-only" : "nav"}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <a href={props.features}>Features</a>
                    </li>
                    <li>
                        <a href={props.aboutus}>About Us</a>
                    </li>
                    <li>
                        <a href={props.contactus}>Contact Us</a>
                    </li>
                    <li className="auth-links">
                        <Link to="/login" className="nav-button login">Login</Link>
                    </li>
                    <li className="auth-links">
                        <Link to="/register" className="nav-button register">Register</Link>
                    </li>
                    <li className="auth-links">
                        <Link to="/results" className="nav-button results">Results</Link>
                    </li>
                </ul>
                
                {/* Mobile menu hamburger icon */}
                <div
                    className={`hamburger ${navbarState ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </nav>
            
            {/* Mobile menu overlay */}
            {isMobile && (
                <div ref={mobileMenuRef} className={`mobile-menu ${navbarState ? 'active' : ''}`}>
                    <button 
                        className="mobile-menu-close" 
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                    <div className="mobile-menu-links">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <a href={props.features} onClick={closeMenu}>Features</a>
                        <a href={props.aboutus} onClick={closeMenu}>About Us</a>
                        <a href={props.contactus} onClick={closeMenu}>Contact Us</a>
                        <Link to="/login" onClick={closeMenu} className="nav-button login">Login</Link>
                        <Link to="/register" onClick={closeMenu} className="nav-button register">Register</Link>
                        <Link to="/results" onClick={closeMenu} className="nav-button results">Results</Link>
                    </div>
                </div>
            )}
            
            {/* Overlay background for mobile menu */}
            {navbarState && isMobile && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={closeMenu}
                    aria-hidden="true"
                ></div>
            )}
        </>
    );
};

export default Navbar;
