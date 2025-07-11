import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedArtworks from './FeaturedArtworks';
import ContactForm from './ContactForm';
import PhotographyToPainting from './PhotographyToPainting';
import '../styles/Home.css';

export default function Home() {
  return (
    <>
      <header className="home-header">
        <div className="hero-content">
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
