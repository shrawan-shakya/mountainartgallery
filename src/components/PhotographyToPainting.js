// src/components/PhotographyToPainting.js
import React from 'react';
import { Link } from 'react-router-dom';
import p2pImage from '../assets/p2p.jpg';
import brush1 from '../assets/brush1.svg'; // 🖌️ Import brush SVG
import '../styles/PhotographyToPainting.css';

export default function PhotographyToPainting() {
  return (
    <section className="photo-painting-container">
      <div className="photo-painting-content">
        <div className="photo-painting-image">
          <img src={p2pImage} alt="Custom portrait artwork example" />
        </div>

        <div className="photo-painting-text">
          {/* SVG behind text */}
          <img src={brush1} alt="" className="brush-behind-heading" aria-hidden="true" />
          
          <h2>Custom Hand-Painted Portraits from Your Photos</h2>
          <p>
            Turn any image into a professional painting with Mountain Art Gallery’s photo-to-art service. Perfect for gifts, decor, and keepsakes.
          </p>
          <div className="center-button-wrapper">
            <Link to="/photo-to-painting" className="explore-button">
              Start Your Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
