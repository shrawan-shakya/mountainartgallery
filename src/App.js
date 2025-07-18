import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Home from './components/Home';
import GalleryPage from './components/GalleryPage';
import HowToBuy from './components/HowToBuy';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import ArtworkDetail from './components/ArtworkDetail';
import Navbar from './components/Navbar';
import PromoBar from './components/PromoBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';



import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    
    <Router>
      <>
      <ScrollToTop />      
        <PromoBar />
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <div style={{ padding: 20 }}>
                    <button onClick={handleLogout} style={{ float: 'right' }}>
                      Logout
                    </button>
                    <Dashboard />
                  </div>
                ) : (
                  <AdminLogin />
                )
              }
            />
          </Routes>
          <Footer />
        </div>
      </>
    </Router>
  );
}

export default App;
