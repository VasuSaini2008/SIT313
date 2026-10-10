import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { auth, db, firebaseReady } from './lib/firebase.js';
import { AuthContext } from './lib/AuthContext.jsx';
function App() {
  const [user, setUser] = useState(null); const [profileName, setProfileName] = useState('');
  useEffect(() => {
    if (!firebaseReady) return undefined;
    return onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser); setProfileName(currentUser?.displayName || '');
      if (currentUser) {
        try { const snap = await getDoc(doc(db, 'users', currentUser.uid)); if (snap.exists()) setProfileName(snap.data().fullName || currentUser.displayName || ''); }
        catch (error) { console.error('Unable to load profile:', error); }
      }
    });
  }, []);
  async function signOutUser() { if (auth) await signOut(auth); }
  return <AuthContext.Provider value={{ user, profileName, signOutUser }}>
    <Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="login" element={user ? <Navigate to="/" replace /> : <Login />} /><Route path="register" element={user ? <Navigate to="/" replace /> : <Register />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
  </AuthContext.Provider>;
}
export default App;
