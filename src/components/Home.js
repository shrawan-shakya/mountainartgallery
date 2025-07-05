import React from 'react';
import { Link } from 'react-router-dom';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import '../styles/Home.css';

export default function Home() {
  return (
    <>
      <header className="home-header container">
        <h1>Discover the Beauty of Nepalese Art.</h1>
        <p className="subtitle">
          Explore breathtaking paintings by local artists at Mountain Art Gallery.
        </p>
        <Link to="/gallery" className="explore-button">Shop Gallery</Link>
      </header>

      <section className="highlight-section container">
        <Gallery />
      </section>

      <section className="contact-section container" id="contact">
        <ContactForm />
      </section>
    </>
  );
}
