import React, { useState, useEffect, useRef } from 'react';

const Navbar = (props) => {
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
                <h1>ChainElect</h1>
            </div>
            <ul className={navbarState ? "nav active" : "nav"}>
                <li>
                    <a href={props.home}>Home</a>
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
            </ul>
            <div
                className="hamburger"
                onClick={() => setNavbarState(!navbarState)}
            >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </nav>
    );
};

export default Navbar;
