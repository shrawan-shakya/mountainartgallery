import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/FeaturedArtworks.css';

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtworks(data);
      } catch (err) {
        console.error('Error fetching featured artworks:', err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="featured-wrapper">
      <h2 className="featured-heading">Featured Artworks</h2>
      <div className="featured-grid">
        {artworks.map((art) => (
          <div key={art.id} className="featured-item">
            <Link to={`/artwork/${art.id}`} className="featured-link">
              <div className="featured-image-wrapper">
                <picture>
                  {(art.imageUrl.endsWith('.jpg') || art.imageUrl.endsWith('.png')) && (
                    <source
                      type="image/webp"
                      srcSet={art.imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                    />
                  )}
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    loading="lazy"
                    className="featured-image"
                  />
                </picture>
              </div>
              <div className="featured-info-label">
                <div className="featured-info-text">
                  <p className="featured-artist">{art.artist || 'Unknown Artist'}</p>
                  <h3 className="featured-title">{art.title}</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
