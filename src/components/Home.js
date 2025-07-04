import React from 'react';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import '../styles/Home.css';

export default function Home() {
  return (
    <>
      <header className="home-header container">
        <h1>Discover the Beauty of Mountains</h1>
        <p className="subtitle">
          Explore breathtaking paintings by local artists at Mountain Art Gallery.
        </p>
      </header>

      <section className="highlight-section container">
        {/* <h2>Featured Collection</h2> */}
        <Gallery />
      </section>

      <section className="contact-section container" id="contact">
        <ContactForm />
      </section>
    </>
  );
}
