// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedArtworks from './FeaturedArtworks';
import ContactForm from './ContactForm';
import PhotographyToPainting from './PhotographyToPainting';

import '../styles/Home.css';

export default function Home() {
  return (
    <>
      {/* Decorative Brush SVG */}
      

      <header className="home-header container">
        <h1>Discover the Beauty of Nepalese Art.</h1>
        
        <p className="subtitle">
          Explore breathtaking paintings by local artists at Mountain Art Gallery.
        </p>
        <Link to="/gallery" className="explore-button">Shop Gallery</Link>
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
