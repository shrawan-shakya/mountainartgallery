import React from 'react';
import '../styles/HowToBuy.css';

export default function HowToBuy() {
  return (
    <div className="how-to-buy container">
      <h1>How to Buy Art from Mountain Art Gallery</h1>
      <p className="intro">
        We’ve made purchasing artwork simple and personal. Follow these steps to inquire about a painting and make it yours.
      </p>

      <div className="steps">
        <div className="step">
          <div className="step-icon">🖼️</div>
          <h3>1. Browse the Collection</h3>
          <p>Explore our curated selection of original artworks by talented mountain artists on the <strong>Shop</strong> page.</p>
        </div>

        <div className="step">
          <div className="step-icon">📩</div>
          <h3>2. Make an Enquiry</h3>
          <p>Click on the <strong>Enquire</strong> button on the painting you love. This opens your email with all details pre-filled.</p>
        </div>

        <div className="step">
          <div className="step-icon">💬</div>
          <h3>3. Get a Response</h3>
          <p>We’ll reply via email with availability, price confirmation, shipping options, and any questions you may have.</p>
        </div>

        <div className="step">
          <div className="step-icon">✅</div>
          <h3>4. Finalize Purchase</h3>
          <p>Once confirmed, we arrange payment and shipping securely. Your new artwork will be packed with care and shipped to your doorstep.</p>
        </div>
      </div>

      <p className="closing-note">
        Need help? <a href="#contact">Contact us</a> anytime for guidance or special requests.
      </p>
    </div>
  );
}
