// components/GalleryPage.js
import React from 'react';
import Gallery from './Gallery';

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: '3rem' }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        All Paintings
      </h2>
      <Gallery />
    </div>
  );
}
