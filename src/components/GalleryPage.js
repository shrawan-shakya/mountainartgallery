// components/GalleryPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Gallery from './Gallery';

export default function GalleryPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const searchTerm = queryParams.get('search') || '';
  const category = queryParams.get('category') || '';

  return (
    <div>
      <Gallery searchTerm={searchTerm} category={category} />
    </div>
  );
}
