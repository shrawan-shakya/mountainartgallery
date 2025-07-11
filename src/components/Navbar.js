import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize searchTerm from URL query param on mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchTerm(search);
  }, [location.search]);

  // Handle Enter key press in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!location.pathname.startsWith('/gallery')) {
        if (searchTerm.trim()) {
          navigate(`/gallery?search=${encodeURIComponent(searchTerm.trim())}`);
        }
      } else {
        const params = new URLSearchParams(location.search);
        if (searchTerm.trim()) {
          params.set('search', searchTerm.trim());
        } else {
          params.delete('search');
        }
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Mountain Art Gallery Logo" />
        </Link>

        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <input
              type="search"
              className="nav-search-input"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </li>
          <li><Link to="/gallery" onClick={closeMenu}>Shop</Link></li>
          <li><Link to="/sale" onClick={closeMenu}><span className="nav-sale">Sale</span></Link></li>
          <li><Link to="/new" onClick={closeMenu}><span className="nav-new">New <span className="star">★</span></span></Link></li>
          <li><Link to="/gift" onClick={closeMenu}>Gift</Link></li>
          <li><Link to="/how-to-buy" onClick={closeMenu}>How to Buy</Link></li>
          <li><a href="/about" onClick={closeMenu}>About</a></li>
        </ul>
      </div>
    </nav>
  );
}
