import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import '../styles/Gallery.css';

// SVG message icon component
function MessageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'artworks'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtworks(data);
      } catch (error) {
        console.error('Error loading artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  const allTags = [...new Set(artworks.flatMap(art => art.tags || []))];

  const filteredArtworks = artworks
    .filter(art =>
      art.title?.toLowerCase().includes(search.toLowerCase()) ||
      art.tags?.join(',').toLowerCase().includes(search.toLowerCase())
    )
    .filter(art => !filterTag || (art.tags || []).includes(filterTag))
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="gallery-section">
      <input
        type="text"
        placeholder="Search by title or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="gallery-search"
      />

      <div className="gallery-controls">
        <div className="gallery-tag-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`gallery-tag-button ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
          {filterTag && (
            <button
              className="gallery-clear-filters"
              onClick={() => setFilterTag('')}
            >
              Clear Filter
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="gallery-sort-select"
        >
          <option value="">Sort by price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      <div className="gallery-grid">
        {filteredArtworks.map(art => (
          <div className="gallery-artwork-item" key={art.id}>
            <Link to={`/artwork/${art.id}`} className="gallery-artwork-link">
              <div className="gallery-artwork-image-wrapper">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="gallery-artwork-image"
                />
              </div>
            </Link>

            <div className="gallery-artwork-info-row">
              <p className="gallery-artwork-artist">{art.artist || 'Unknown Artist'}</p>
              <a
                href={`mailto:mag.boudha@gmail.com?subject=Enquiry about artwork: ${encodeURIComponent(art.title)}`}
                className="enquire-button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enquire about ${art.title}`}
                title="Enquire"
              >
                <MessageIcon />
              </a>
            </div>

            <Link to={`/artwork/${art.id}`} className="gallery-artwork-link">
              <h3 className="gallery-artwork-title">{art.title}</h3>
            </Link>
          </div>
        ))}
        {filteredArtworks.length === 0 && (
          <p className="gallery-no-results">No artworks found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
