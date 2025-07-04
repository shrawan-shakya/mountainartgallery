import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [medium, setMedium] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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

    testStorageConnection();
  }, []);

  const testStorageConnection = () => {
    try {
      const testRef = ref(storage, 'test-file.txt');
      console.log('✅ Firebase Storage is working:', testRef);
    } catch (error) {
      console.error('❌ Firebase Storage error:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!imageFile) {
      setError('Please select an image file to upload.');
      return;
    }

    if (!price || isNaN(parseFloat(price))) {
      setError('Please enter a valid numeric price.');
      return;
    }

    try {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `artworks/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (uploadErr) => {
          console.error('🔥 Upload failed during file transfer:', uploadErr.message);
          setError('Image upload failed. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const artworkData = {
            title,
            price: parseFloat(price),
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            imageUrl: downloadURL,
            description,
            artist,
            dimensions,
            medium,
            createdAt: new Date()
          };

          console.log('✅ Saving artwork with data:', artworkData);

          try {
            await addDoc(collection(db, 'artworks'), artworkData);

            setSuccess('Artwork uploaded successfully!');
            setTitle('');
            setPrice('');
            setTags('');
            setImageFile(null);
            setDescription('');
            setArtist('');
            setDimensions('');
            setMedium('');
            setUploadProgress(0);
          } catch (firestoreErr) {
            console.error('🔥 Firestore save failed:', firestoreErr.message);
            setError(`Failed to upload artwork: ${firestoreErr.message}`);
          }
        }
      );
    } catch (err) {
      console.error('🔥 Unexpected error during upload:', err.message);
      setError(`Failed to upload artwork: ${err.message}`);
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
