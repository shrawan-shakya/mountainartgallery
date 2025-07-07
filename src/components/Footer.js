import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-columns">
          {/* Left Column: Branding + Socials */}
          <div className="footer-col footer-branding">
            <h3 className="footer-logo">Mountain Art Gallery</h3>
            <p className="footer-tagline">
              An online gallery showcasing original paintings by emerging and established Nepali artists. Our artworks grace private collections and luxury spaces. Custom painting commissions are also welcome.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
              <a href="https://pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">Pinterest</a>
            </div>
          </div>

          {/* Center Left Column: Explore */}
          <div className="footer-col footer-links-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/gallery">Shop</Link></li>
              <li><Link to="/how-to-buy">How to Buy</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Center Right Column: Services */}
          <div className="footer-col footer-services-col">
            <h4>Services</h4>
            <ul className="footer-services">
              <li><Link to="/photo-to-painting">Photo to Painting</Link></li>
              <li><Link to="/framing-guide">Framing Guide</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Right Column: Payment Options */}
          <div className="footer-col footer-payments-col">
            <h4>Payment Options</h4>
            <ul className="footer-payments">
              <li>Visa</li>
              <li>eSewa</li>
              <li>Bank Transfer</li>
            </ul>
          </div>
        </div>

        {/* Legal Links Bottom Row */}
        <div className="footer-legal">
          <Link to="/shipping">Shipping</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/returns">Returns</Link>
        </div>

        {/* Copyright */}
        <p className="footer-copy">&copy; {new Date().getFullYear()} Mountain Art Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
}
