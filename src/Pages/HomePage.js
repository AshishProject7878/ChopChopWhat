import { useEffect, useRef } from "react"; // Import useRef
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate } from "react-router-dom"; // Use this for navigation if you have React Router

import "../Styles/style.css";
import brain from "../Assests/Confused.webp";
import bowl from "../Assests/Chicken Rice.webp";
import ingredients from "../Assests/ingredients.webp";
import cuisine from "../Assests/cuisines.png";
import pref from "../Assests/veg non veg.webp";

const HomePage = () => {
  // Create a main ref to scope our GSAP selectors. This is a best practice.
  const main = useRef();
  // If using React Router, initialize the navigate hook
  // const navigate = useNavigate();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Use gsap.context() for scoping and automatic cleanup.
    // All GSAP animations and ScrollTriggers created inside will be reverted when the component unmounts.
    const ctx = gsap.context(() => {
      // Animate each word in hero title on load
      gsap.fromTo(
        ".word",
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.1 },
        }
      );

      // Animate whole sections - use gsap.utils.toArray to target each one individually
      gsap.utils.toArray(".section-anim").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // About text animation (left to right)
      gsap.from(".about-text", {
        x: -100,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Bowl image animation (right to left)
      gsap.from(".bowl", {
        x: 100,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bowl",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, main); // <-- Scope the context to our main ref

    // Cleanup function
    return () => ctx.revert();
  }, []);

  // Handle navigation with a fade-out effect
  const handleNavigation = (e, path) => {
    e.preventDefault();
    document.body.classList.add("fade-out");
    setTimeout(() => {
      // For a multi-page app, this is fine:
      window.location.href = path;
      // For a single-page app with React Router, use this:
      // navigate(path);
      // You'd also need logic to remove the fade-out class on the new page
    }, 500);
  };

  return (
    // Attach the main ref to the root element of your component
    <div className="main" ref={main}>
      {/* Hero section */}
      <section className="hero">
        <h1 className="main-title" id="animated-title">
          <span className="word">Can't</span>
          <span className="word"> Decide</span> <br />
          <span className="word black-text"> What</span>
          <span className="word black-text"> To</span>
          <span className="word"> Cook?</span>
        </h1>
        <div className="bottom-section">
          <div className="img-container">
            <img src={brain} alt="Confused Brain" />
          </div>
          {/* Use React's onClick for event handling */}
          <div
            className="cta-btn"
            id="cta-animated"
          >
            <Link to="/search" className="btn">
              Let Us Help You
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Add a shared class for animation */}
      <section className="about section-anim">
        <h1 className="main-title">
          <span className="black-text">Presenting</span> <br />
          ChopChopWhat
        </h1>
        <div className="about-section">
          <p className="about-text">
            We’re the quirky kitchen companion that takes your “uhh...” and
            turns it into “ohh, yum!” Just type in any ingredient (even that
            mystery thing you bought during your healthy-eating phase), choose
            your cuisine, and tell us if you’re riding the veggie train or going
            full carnivore — and boom! Recipes appear like magic. No stress, no
            tears, no burnt toast. <br />
            <br />
            So the next time your brain goes <b>"Chop chop... what?"</b>, you
            know where to click.
          </p>
          <div className="img-container">
            <img src={bowl} alt="Chicken Rice Bowl" className="bowl" />
          </div>
        </div>
      </section>

      {/* Steps Section - Add a shared class for animation */}
      <section className="steps section-anim">
        {/* ... your cards here ... */}
        <div className="card-1">
          <div className="card-img">
            <img src={ingredients} alt="Ingredients" />
          </div>
          <div className="card-text">
            <p>
              Have some <span className="red-text">ingredient</span> in mind?{" "}
              <br /> <span className="red-text">Type it in</span>
            </p>
          </div>
        </div>
        <div className="card-1">
          <div className="card-img cuisine-img">
            <img src={cuisine} alt="Cuisine" />
          </div>
          <div className="card-text">
            <p>
              Have some <span className="red-text">Cuisine</span> in mind?{" "}
              <br /> <span className="red-text">Select that in</span>
            </p>
          </div>
        </div>
        <div className="card-1">
          <div className="card-img veg-non-veg-img">
            <img src={pref} alt="Preference" />
          </div>
          <div className="card-text">
            <p>
              Got a veg or <span className="red-text">non-veg</span> mood?{" "}
              <br /> <span className="red-text">Pick it here!</span>
            </p>
          </div>
        </div>
      </section>

      <div
        className="service-btn"
      >
        <button className="cta-btn">
          <Link to="/search" className="btn">
            See Our Magic
          </Link>
        </button>
      </div>

      <footer className="footer">All Rights Reserved &copy; 2025</footer>
    </div>
  );
};

export default HomePage;
