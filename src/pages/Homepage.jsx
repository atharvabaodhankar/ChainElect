import React, { useState } from 'react'
import Button from '../components/button';
import Features from './Features';

const Homepage = () => {
  const [navbarState, setNavbarState] = useState(false);
  
  return (
    <>
    <section id='hero'>
      <video src="src\images\hero.mp4" autoPlay loop muted></video>
      <nav id='navbar'>
        <div className='logo'>
          <h1>ChainElect</h1>
        </div>
        <ul className={navbarState ? 'nav active' : 'nav'}>
          <li>Home</li>
          <li>Features</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
        <div className="hamburger" onClick={() => setNavbarState(!navbarState)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className="hero">
        <h1>Secure Voting</h1>
        <p>Lorem ipsum dolor sit a natus nemo consectetur numquam impedit autem, aut debitis animi accusantium. Debitis nobis fugiat quo illo numquam recusandae libero doloribus dignissimos ipsam, beatae sequi culpa omnis accusantium inventore sint eius atque exercitationem. Dolores expedita dolorum dicta fuga.</p>
        <Button name='Get Started' link='/' />
      </div>
      
    </section>
    <section>
      <Features />
    </section>
    </>
  )
}

export default Homepage