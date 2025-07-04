import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import '../styles/ArtworkDetail.css';

export default function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'artworks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtwork(docSnap.data());
        } else {
          setArtwork(null);
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setArtwork(null);
      }
      setLoading(false);
    };

    fetchArtwork();
  }, [id]);

  if (loading) return <p>Loading artwork details...</p>;
  if (!artwork) return <p>Artwork not found.</p>;

  return (
    <div className="artwork-detail-container">
      <div className="artwork-detail-image-wrapper">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="artwork-detail-image"
        />
      </div>
      <div className="artwork-detail-info">
        <h1 className="artwork-detail-title">{artwork.title}</h1>
        <p className="artwork-detail-artist"><strong>Artist:</strong> {artwork.artist}</p>
        <p className="artwork-detail-price"><strong>Price:</strong> ${artwork.price.toFixed(2)}</p>
        <p className="artwork-detail-medium"><strong>Medium:</strong> {artwork.medium}</p>
        <p className="artwork-detail-dimensions"><strong>Dimensions:</strong> {artwork.dimensions}</p>
        <p className="artwork-detail-tags"><strong>Tags:</strong> {artwork.tags?.join(', ')}</p>
        <p className="artwork-detail-description">{artwork.description}</p>

        <a
          href={`mailto:mag.boudha@gmail.com?subject=Enquiry about artwork: ${encodeURIComponent(artwork.title)}`}
          className="artwork-detail-enquire-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire
        </a>
      </div>
    </div>
  );
}
