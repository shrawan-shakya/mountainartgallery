import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Gallery.css';

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
            <img src={art.imageUrl} alt={art.title} className="gallery-artwork-image" />
            <p className="gallery-artwork-price">${art.price.toFixed(2)}</p>
            <h3 className="gallery-artwork-title">{art.title}</h3>
            <p className="gallery-artwork-tags">{art.tags?.join(', ')}</p>
            <a
              href={`mailto:youremail@example.com?subject=Enquiry about artwork: ${encodeURIComponent(art.title)}`}
              className="enquire-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire
            </a>
          </div>
        ))}
        {filteredArtworks.length === 0 && (
          <p className="gallery-no-results">No artworks found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
