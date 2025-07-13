// components/Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Breadcrumb.css';

export default function Breadcrumb() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get('category');

  return (
    <nav className="breadcrumb">
      <Link to="/gallery" className="breadcrumb-link">Shop</Link>
      {category && (
        <>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/gallery?category=${category}`} className="breadcrumb-link">
            {decodeURIComponent(category).replace(/^\w/, c => c.toUpperCase())}
          </Link>
        </>
      )}
    </nav>
  );
}
