import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = (props) => {
    const { t } = useTranslation();
    const [navbarState, setNavbarState] = useState(false);
    const navbarRef = useRef(null);  // Use useRef to reference the navbar DOM element

    useEffect(() => {
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

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);  // Empty array ensures the effect runs once on component mount

    return (
        <nav id="navbar" ref={navbarRef}>
            <div className="logo">
                <Link to="/">
                    <h1>{t('app.title')}</h1>
                </Link>
            </div>
            <ul className={navbarState ? "nav active" : "nav"}>
                <li>
                    <Link to="/">{t('nav.home')}</Link>
                </li>
                <li>
                <Link to="/register">{t('nav.register')}</Link>
                </li>
                <li>
                    <Link to="/voting-revolution">{t('nav.votingRevolution')}</Link>
                </li>
                <li>
                    <Link to="/how-it-works">{t('nav.howItWorks')}</Link>
                </li>

                <li>
                    <a href={props.contactus}>{t('nav.contact')}</a>
                </li>
                <li className="auth-links">
                    <Link to="/login" className="nav-button login">{t('nav.login')}</Link>
                </li>
                <li>
                    <LanguageSelector />
                </li>
            </ul>
            <div className="hamburger" onClick={() => {setNavbarState(!navbarState)}}>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>
        </nav>
    );
};

export default Navbar;
