import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import '../styles/Gallery.css';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [mediumFilter, setMediumFilter] = useState('');
  const [sort, setSort] = useState('');

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

  const allMediums = [...new Set(artworks.map(art => art.medium).filter(Boolean))];

  const filteredArtworks = artworks
    .filter(art => {
      const searchLower = search.toLowerCase();
      const inTitle = art.title?.toLowerCase().includes(searchLower);
      const inTags = (art.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
      return search === '' || inTitle || inTags;
    })
    .filter(art => {
      if (!mediumFilter) return true;
      return art.medium === mediumFilter;
    })
    .filter(art => {
      const price = Number(art.price);
      const min = Number(priceRange.min);
      const max = Number(priceRange.max);
      if (priceRange.min !== '' && price < min) return false;
      if (priceRange.max !== '' && price > max) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return 0;
    });

  const clearFilters = () => {
    setSearch('');
    setPriceRange({ min: '', max: '' });
    setMediumFilter('');
    setSort('');
  };

  return (
    <div className="gallery-section">
      <h2 className="gallery-section-title">Explore Our Collection</h2>

      <div className="gallery-controls">
        <input
          type="text"
          placeholder="Search by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="gallery-search"
        />

        <label className="gallery-price-label" data-label="Min Price">
          <input
            type="number"
            min="0"
            value={priceRange.min}
            onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="gallery-price-input"
            placeholder="0"
          />
        </label>

        <label className="gallery-price-label" data-label="Max Price">
          <input
            type="number"
            min="0"
            value={priceRange.max}
            onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="gallery-price-input"
            placeholder="No max"
          />
        </label>

        <select
          value={mediumFilter}
          onChange={e => setMediumFilter(e.target.value)}
          className="gallery-sort-select"
        >
          <option value="">All Mediums</option>
          {allMediums.map(med => (
            <option key={med} value={med}>{med}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="gallery-sort-select"
        >
          <option value="">Sort by price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        <button
          className="gallery-clear-filters"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {filteredArtworks.length === 0 ? (
        <div className="gallery-empty">
          <p className="gallery-no-results">No artworks found matching your criteria.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredArtworks.map(art => (
            <div className="gallery-artwork-item" key={art.id}>
              <Link to={`/artwork/${art.id}`} className="gallery-artwork-link">
                <div className="gallery-artwork-image-wrapper">
                  <picture>
                    {/* Try WebP version if URL supports it */}
                    {art.imageUrl.endsWith('.jpg') || art.imageUrl.endsWith('.png') ? (
                      <source
                        type="image/webp"
                        srcSet={art.imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                      />
                    ) : null}
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="gallery-artwork-image"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="gallery-info-label">
                  <div className="gallery-info-text">
                    <p className="gallery-artwork-artist">{art.artist || 'Unknown Artist'}</p>
                    <h3 className="gallery-artwork-title">{art.title}</h3>
                    <p className="gallery-artwork-size">{art.dimensions || 'Size unknown'}</p>
                  </div>
                  <p className="gallery-artwork-price">${art.price?.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
