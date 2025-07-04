const handleUpload = async (e) => {
  e.preventDefault();
  setSuccess('');
  setError('');

  if (!imageFile) {
    setError('Please select an image file.');
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
      (error) => {
        console.error('❌ Upload error:', error);
        setError('Upload failed. Please try again.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('✅ Uploaded! URL:', downloadURL);

        const artworkData = {
          title,
          price: parseFloat(price),
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          imageUrl: downloadURL,
          description,
          artist,
          dimensions,
          medium,
          createdAt: new Date(),
        };

        try {
          await addDoc(collection(db, 'artworks'), artworkData);
          setSuccess('Artwork uploaded!');
          // Reset form fields
          setTitle(''); setPrice(''); setTags('');
          setImageFile(null); setDescription('');
          setArtist(''); setDimensions(''); setMedium('');
          setUploadProgress(0);
        } catch (firestoreErr) {
          console.error('❌ Firestore error:', firestoreErr);
          setError('Failed to save artwork. Check console for details.');
        }
      }
    );
  } catch (err) {
    console.error('❌ Upload setup error:', err);
    setError('Unexpected error during upload.');
  }
};
