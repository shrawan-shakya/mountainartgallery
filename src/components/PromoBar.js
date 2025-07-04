// src/components/PromoBar.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/PromoBar.css';

const PROMO_KEY = 'promoDismissedUntil';
const DISMISS_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export default function PromoBar() {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const now = Date.now();
        const dismissedUntil = parseInt(localStorage.getItem(PROMO_KEY), 10);

        if (!dismissedUntil || now > dismissedUntil) {
          const docRef = doc(db, 'site-settings', 'promo');
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const promoText = snapshot.data().text; // 🔁 Make sure 'text' matches your field name in Firestore
            if (promoText) {
              setText(promoText);
              setVisible(true);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching promo text:', err);
      }
    };

    fetchPromo();
  }, []);

  const handleDismiss = () => {
    const until = Date.now() + DISMISS_DURATION_MS;
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
