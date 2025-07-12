import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedArtworks from './FeaturedArtworks';
import ContactForm from './ContactForm';
import PhotographyToPainting from './PhotographyToPainting';
import '../styles/Home.css';
import heroMobile from '../assets/hero-mobile.jpg'; // Ensure this image exists

export default function Home() {
  return (
    <>
      <header className="home-header">
        {/* Mobile Hero Image */}
        <img src={heroMobile} alt="Art Hero" className="hero-image-mobile" />

        <div className="hero-content">
          {/* Desktop Hero Text */}
          <div className="hero-text-desktop">
            <h1>
              Shop our selection of <br />
              one‑of‑a‑kind paintings.
            </h1>

            <p className="subtitle">
              Our talented artists create beautiful, meaningful paintings that are
              sure to be treasured for years to come.
            </p>

            <p className="subtitle">
              • 1000s of paintings&nbsp;&nbsp;• 20&nbsp;years of experience
            </p>
          </div>

          {/* Mobile Hero Text */}
          <div className="hero-text-mobile">
            <h1>Find Your Next Masterpiece</h1>
            <p className="subtitle">Thousands of stunning paintings created by passionate artists from Nepal.

</p>
          </div>

          <Link to="/gallery" className="explore-button">
            Shop Gallery
          </Link>
        </div>
      </header>

      <section className="highlight-section container">
        <FeaturedArtworks />
      </section>

      <section className="photography-to-painting-section">
        <PhotographyToPainting />
      </section>

      <section className="contact-section container" id="contact">
        <ContactForm />
      </section>
    </>
  );
}
