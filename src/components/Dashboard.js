import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
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

  const [artworks, setArtworks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [promoText, setPromoText] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadPromo = async () => {
      const promoRef = doc(db, 'site-settings', 'promo');
      const snap = await getDoc(promoRef);
      if (snap.exists()) setPromoText(snap.data().text || '');
    };
    loadPromo();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artworks'));
        const arts = [];
        querySnapshot.forEach((doc) => {
          arts.push({ id: doc.id, ...doc.data() });
        });
        setArtworks(arts);
      } catch (err) {
        console.error('Failed to load artworks:', err);
      }
    };
    fetchArtworks();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setUploadProgress(0);

    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }
    if (!title || !price || !medium) {
      setError('Please fill in required fields.');
      return;
    }
    if (!imageFile && !editId) {
      setError('Please select an image file.');
      return;
    }

    try {
      let downloadURL = null;

      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const fileName = `${Date.now()}_${compressedFile.name}`;
        const storageRef = ref(storage, `artworks/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (uploadError) => reject(uploadError),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                downloadURL = url;
                resolve();
              });
            }
          );
        });
      }

      const artworkData = {
        title,
        price: parseFloat(price),
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        description,
        artist,
        dimensions,
        medium,
        updatedAt: Timestamp.now(),
      };
      if (downloadURL) artworkData.imageUrl = downloadURL;

      if (editId) {
        const docRef = doc(db, 'artworks', editId);
        await updateDoc(docRef, artworkData);

        if (imageFile && artworks.find((a) => a.id === editId)?.imageUrl) {
          const oldUrl = artworks.find((a) => a.id === editId).imageUrl;
          try {
            const oldRef = ref(
              storage,
              oldUrl.split('/o/')[1].split('?')[0].replace('%2F', '/')
            );
            await deleteObject(oldRef);
          } catch (e) {
            console.warn('Old image deletion failed:', e);
          }
        }

        setSuccess('Artwork updated successfully!');
      } else {
        artworkData.createdAt = Timestamp.now();
        await addDoc(collection(db, 'artworks'), artworkData);
        setSuccess('Artwork uploaded successfully!');
      }

      setTitle('');
      setPrice('');
      setTags('');
      setImageFile(null);
      setDescription('');
      setArtist('');
      setDimensions('');
      setMedium('');
      setEditId(null);
      setUploadProgress(0);

      const querySnapshot = await getDocs(collection(db, 'artworks'));
      const arts = [];
      querySnapshot.forEach((doc) => {
        arts.push({ id: doc.id, ...doc.data() });
      });
      setArtworks(arts);
    } catch (uploadError) {
      console.error(uploadError);
      setError('Upload failed: ' + uploadError.message);
    }
  };

  const startEdit = (artwork) => {
    setTitle(artwork.title);
    setPrice(artwork.price);
    setTags(artwork.tags.join(', '));
    setDescription(artwork.description);
    setArtist(artwork.artist);
    setDimensions(artwork.dimensions);
    setMedium(artwork.medium);
    setEditId(artwork.id);
    setImageFile(null);
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await deleteDoc(doc(db, 'artworks', id));

      if (imageUrl) {
        const path = decodeURIComponent(
          imageUrl.split('/o/')[1].split('?')[0]
        ).replace(/\+/g, ' ');
        const imageRef = ref(storage, path);
        await deleteObject(imageRef);
      }

      setArtworks((arts) => arts.filter((a) => a.id !== id));
      setSuccess('Artwork deleted successfully!');
      setError('');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete artwork.');
      setSuccess('');
    }
  };

  if (user === null) return <p>Loading authentication...</p>;
  if (!user) return <p>Please log in to access the dashboard.</p>;

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
        <button
          onClick={async () => {
            try {
              await setDoc(doc(db, 'site-settings', 'promo'), { text: promoText });
              alert('Promotion text updated!');
            } catch {
              alert('Failed to update promotion text.');
            }
          }}
        >
          Update Promo
        </button>
      </section>

      <section className="upload-form">
        <h3>{editId ? 'Edit Artwork' : 'Upload New Artwork'}</h3>
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
            type="number"
            step="0.01"
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
            key={imageFile ? imageFile.name : 'fileInput'}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required={!editId}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
          <button type="submit">{editId ? 'Update Artwork' : 'Upload Artwork'}</button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setTitle('');
                setPrice('');
                setTags('');
                setImageFile(null);
                setDescription('');
                setArtist('');
                setDimensions('');
                setMedium('');
                setSuccess('');
                setError('');
                setUploadProgress(0);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="artworks-list">
        <h3>Existing Artworks</h3>
        {artworks.length === 0 && <p>No artworks found.</p>}
        <div className="artwork-grid">
          {artworks.map((art) => (
            <div key={art.id} className="artwork-card">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="artwork-thumb"
                loading="lazy"
              />
              <strong className="artwork-title">{art.title}</strong>
              <div className="artwork-price">${art.price.toFixed(2)}</div>
              <button className="edit-btn" onClick={() => startEdit(art)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(art.id, art.imageUrl)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
