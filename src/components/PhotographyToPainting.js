// src/components/PhotographyToPainting.js
import React from 'react';
import { Link } from 'react-router-dom';
import p2pImage from '../assets/p2p.jpg';
import '../styles/PhotographyToPainting.css';

export default function PhotographyToPainting() {
  return (
    <section className="photo-painting-container">
      <div className="photo-painting-content">
        <div className="photo-painting-image">
          <img src={p2pImage} alt="Custom portrait artwork example" />
        </div>
        <div className="photo-painting-text">
          <h2>Transform Your Memories into Art</h2>
          <p>
            Turn your favorite photos into beautiful hand-painted artworks by talented Nepali artists.
          </p>
          <div className="center-button-wrapper">
            <Link to="/photo-to-painting" className="explore-button">
              Learn How
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
