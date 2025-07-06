import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import '../styles/ArtworkDetail.css';

export default function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

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

  const handleOpenModal = () => {
    setShowModal(true);
    setMessageSent(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xwpbzkyg', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        form.reset();
        setMessageSent(true);
        setTimeout(() => {
          setMessageSent(false);
          setShowModal(false);
        }, 2500); // close after 2.5s
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <div className="artwork-detail-container">
        <div className="artwork-detail-image-wrapper">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="artwork-detail-image"
            loading="lazy"
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

          <button className="artwork-detail-enquire-button" onClick={handleOpenModal}>
            Enquire
          </button>
        </div>
      </div>

      {showModal && (
        <div className="enquiry-modal-overlay" onClick={handleCloseModal}>
          <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <button className="enquiry-close-button" onClick={handleCloseModal}>&times;</button>
            <h3>Send an Enquiry</h3>

            {messageSent ? (
              <div className="enquiry-sent-message">Message sent successfully!</div>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="artwork" value={artwork.title} />
                  <input type="text" name="name" placeholder="Your Name" required />
                  <input type="email" name="_replyto" placeholder="Your Email" required />
                  <textarea name="message" placeholder="Your Message" rows="4" required />
                  <button type="submit">Send</button>
                </form>

                <div className="enquiry-or-label">or</div>
                <a
                  href={`https://wa.me/61450704907?text=Hi, I’d like to enquire about "${encodeURIComponent(artwork.title)}"`}
                  className="enquiry-whatsapp-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
