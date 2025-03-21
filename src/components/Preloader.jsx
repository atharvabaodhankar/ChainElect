import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = () => {
  const preloaderRef = useRef(null);
  const titleRef = useRef(null);
  const subTextRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressNumberRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initial state
    gsap.set([titleRef.current, subTextRef.current], { 
      opacity: 0, 
      y: 20 
    });
    
    gsap.set(progressBarRef.current, {
      width: 0,
    });

    gsap.set(circleRef.current, {
      scale: 0,
      rotation: -180
    });

    // Animate in
    tl.to(circleRef.current, {
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to([titleRef.current, subTextRef.current], {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.5")
    .to(progressBarRef.current, {
      width: "100%",
      duration: 1.5,
      ease: "power3.inOut"
    }, "-=0.5")
    .to(progressNumberRef.current, {
      innerText: 100,
      duration: 1.5,
      snap: { innerText: 1 },
      ease: "power3.inOut"
    }, "-=1.5");

    // Animate out
    setTimeout(() => {
      tl.to(circleRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.8,
        ease: "power4.inOut"
      })
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power4.inOut"
      }, "-=0.4");
    }, 3000);
  }, []);

  return (
    <div ref={preloaderRef} className="preloader">
      <div ref={circleRef} className="preloader-circle"></div>
      <div className="preloader-content">
        <h1 ref={titleRef} className="preloader-title">ChainElect</h1>
        <p ref={subTextRef} className="preloader-subtext">Secure Voting System</p>
        <div className="preloader-progress-wrapper">
          <div className="preloader-progress-container">
            <div ref={progressBarRef} className="preloader-progress-bar"></div>
          </div>
          <span ref={progressNumberRef} className="preloader-progress-number">0</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader; 