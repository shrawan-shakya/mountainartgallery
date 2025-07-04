import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import '../styles/Dashboard.css';

export default function Dashboard() {
  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [medium, setMedium] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Feedback states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [promoText, setPromoText] = useState('');

  useEffect(() => {
    // Load promo text once on mount
    const loadPromo = async () => {
      const promoRef = doc(db, 'site-settings', 'promo');
      const snap = await getDoc(promoRef);
      if (snap.exists()) setPromoText(snap.data().text || '');
    };
    loadPromo();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    setSuccess('');
    setError('');
    setUploadProgress(0);

    // Basic validation
    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('Please enter a valid numeric price.');
      return;
    }

    try {
      // Prepare filename and storage ref
      const fileName = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `artworks/${fileName}`);

      // Start upload
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      // Listen for state changes, errors, completion
      uploadTask.on('state_changed',
        (snapshot) => {
          // Upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (uploadError) => {
          // Handle upload errors
          console.error('Upload error:', uploadError);
          setError('Image upload failed. Please try again.');
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Prepare Firestore data object
          const artworkData = {
            title,
            price: parseFloat(price),
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            imageUrl: downloadURL,
            description,
            artist,
            dimensions,
            medium,
            createdAt: new Date()
          };

          // Save artwork document
          try {
            await addDoc(collection(db, 'artworks'), artworkData);
            setSuccess('Artwork uploaded successfully!');
            // Clear form
            setTitle('');
            setPrice('');
            setTags('');
            setImageFile(null);
            setDescription('');
            setArtist('');
            setDimensions('');
            setMedium('');
            setUploadProgress(0);
          } catch (firestoreError) {
            console.error('Firestore save error:', firestoreError);
            setError('Failed to save artwork info. Please try again.');
          }
        }
      );

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred. Please try again.');
    }
  };

  const updatePromoText = async () => {
    try {
      await setDoc(doc(db, 'site-settings', 'promo'), { text: promoText });
      alert('Promotion text updated!');
    } catch (err) {
      console.error('Promo update error:', err);
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
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p>Uploading Image: {Math.round(uploadProgress)}%</p>
        )}

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
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
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
