import React from 'react';
import '../styles/HowToBuy.css';

export default function HowToBuy() {
  return (
    <div className="how-to-buy-container">
      <h1>How to Buy Artwork</h1>
      
      <section className="step">
        <h2>1. Browse Our Collection</h2>
        <p>Explore our wide selection of mountain paintings created by local artists. Visit the <a href="/gallery">All Paintings</a> page to see details and images.</p>
      </section>

      <section className="step">
        <h2>2. Select Your Favorite Artwork</h2>
        <p>Click on any painting to view more details including artist information, size, and price.</p>
      </section>

      <section className="step">
        <h2>3. Enquire About the Artwork</h2>
        <p>On the artwork detail page, click the <strong>Enquire</strong> button. This will open your email client with a pre-filled subject so you can ask questions or express your interest directly to us.</p>
      </section>

      <section className="step">
        <h2>4. Await Our Response</h2>
        <p>We’ll reply promptly with availability, payment options, and any additional information you need to complete your purchase.</p>
      </section>

      <section className="step">
        <h2>5. Complete Your Purchase</h2>
        <p>Once everything is confirmed, we will provide secure payment instructions and arrange delivery or pickup of your artwork.</p>
      </section>

      <section className="contact-info">
        <h2>Need Help?</h2>
        <p>If you have any questions, feel free to <a href="#contact">contact us</a> anytime.</p>
      </section>
    </div>
  );
}
