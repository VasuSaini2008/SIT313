import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../lib/firebase.js';

const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export default function Register() {
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    if (!firebaseReady) { setError('Firebase is not configured. Follow the README setup steps.'); return; }
    if (name.trim().split(/\s+/).length < 2) { setError('Enter your first and last name.'); return; }
    if (!validEmail(email.trim())) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must contain at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid, fullName: name.trim(), email: email.trim().toLowerCase(), createdAt: serverTimestamp()
      });
      // Firebase Authentication securely handles passwords; Firestore stores profile details only.
      await auth.signOut();
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account already exists for this email.' : `Could not create account: ${err.message}`);
    } finally { setBusy(false); }
  }

  return <section className="auth-card register-card">
    <h1>Create a DEV@Deakin Account</h1><p className="muted">Join the community.</p>
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="full-name">Name*</label><input id="full-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required />
      <label htmlFor="register-email">Email*</label><input id="register-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label htmlFor="register-password">Password*</label><input id="register-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required />
      <label htmlFor="confirm-password">Confirm password*</label><input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      {error && <p className="message error" role="alert">{error}</p>}
      <button className="button full" disabled={busy}>{busy ? 'Creating account…' : 'Create'}</button>
    </form>
    <p className="switch-link">Already registered? <Link to="/login">Login</Link></p>
  </section>;
}
