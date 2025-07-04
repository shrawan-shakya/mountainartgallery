// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [medium, setMedium] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [promoText, setPromoText] = useState('');

  useEffect(() => {
    const loadPromo = async () => {
      const promoRef = doc(db, 'site-settings', 'promo');
      const snap = await getDoc(promoRef);
      if (snap.exists()) {
        setPromoText(snap.data().text || '');
      }
    };
    loadPromo();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await addDoc(collection(db, 'artworks'), {
        title,
        price: parseFloat(price),
        tags: tags.split(',').map(tag => tag.trim()),
        imageUrl,
        description,
        artist,
        dimensions,
        medium,
        createdAt: new Date()
      });

      setSuccess('Artwork uploaded successfully!');
      setTitle('');
      setPrice('');
      setTags('');
      setImageUrl('');
      setDescription('');
      setArtist('');
      setDimensions('');
      setMedium('');
    } catch (err) {
      console.error(err);
      setError('Failed to upload artwork. Try again.');
    }
  };

  const updatePromoText = async () => {
    try {
      await setDoc(doc(db, 'site-settings', 'promo'), { text: promoText });
      alert('Promotion text updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update promotion text.');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h2>Admin Dashboard</h2>

      <section className="promo-editor">
        <h3>Promotion Bar Text</h3>
        <textarea
          value={promoText}
          onChange={(e) => setPromoText(e.target.value)}
          placeholder="Enter promotional message..."
        />
        <button onClick={updatePromoText}>Update Promo</button>
      </section>

      <section className="upload-form">
        <h3>Upload New Artwork</h3>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Artwork Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Price (e.g. 200)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dimensions (e.g. 40x60 cm)"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            required
          >
            <option value="">Select Medium</option>
            <option value="Oil on Canvas">Oil on Canvas</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Watercolor">Watercolor</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Digital">Digital</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
          <button type="submit">Upload</button>
        </form>
      </section>
    </div>
  );
}
