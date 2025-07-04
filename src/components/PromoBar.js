// src/components/PromoBar.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/PromoBar.css';

const PROMO_KEY = 'promoDismissedUntil';


export default function PromoBar() {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const now = Date.now();
        const dismissedUntil = parseInt(localStorage.getItem(PROMO_KEY), 10);

        // Only show if promo wasn't dismissed or expired
        if (!dismissedUntil || now > dismissedUntil) {
          const docRef = doc(db, 'site-settings', 'promo');
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setText(snapshot.data().text);
            setVisible(true);
          }
        }
      } catch (err) {
        console.error('Error fetching promo text:', err);
      }
    };

    fetchPromo();
  }, []);

  const handleDismiss = () => {
    const until = Date.now() + 6000;
    localStorage.setItem(PROMO_KEY, until.toString());
    setVisible(false);
  };

  if (!text || !visible) return null;

  return (
    <div className="promo-bar">
      <p>{text}</p>
      <button className="promo-dismiss" onClick={handleDismiss}>×</button>
    </div>
  );
}
