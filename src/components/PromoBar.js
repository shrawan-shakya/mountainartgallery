// src/components/PromoBar.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/PromoBar.css';

export default function PromoBar() {
  const [promoText, setPromoText] = useState('');
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const fetchPromoText = async () => {
      try {
        const docRef = doc(db, 'site-settings', 'promo');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPromoText(docSnap.data().text || '');
        } else {
          console.warn('Promo document not found');
        }
      } catch (error) {
        console.error('Error fetching promo text:', error);
      }
    };

    fetchPromoText();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowPromo(window.scrollY <= 10); // Only show when at the top
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!promoText || !showPromo) return null;

  return (
    <div className="promo-bar">
      <span>{promoText}</span>
    </div>
  );
}
