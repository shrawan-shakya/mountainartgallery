import React from 'react';
import { useLocation } from 'react-router-dom';
import Gallery from './Gallery';

export default function GalleryPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search') || '';

  return <Gallery searchTerm={searchTerm} />;
}
