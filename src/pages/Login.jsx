import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseReady } from '../lib/firebase.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    if (!firebaseReady) { setError('Firebase is not configured. Follow the README setup steps.'); return; }
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setBusy(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); navigate('/'); }
    catch (err) { setError(err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Email or password is incorrect. Try again or create an account.' : err.message); }
    finally { setBusy(false); }
  }

  return <section className="auth-card">
    <h1>Login</h1><p className="muted">Welcome back to DEV@Deakin.</p>
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="login-email">Your email</label>
      <input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label htmlFor="login-password">Your password</label>
      <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p className="message error" role="alert">{error}</p>}
      <button className="button full" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
    </form>
    <p className="switch-link">New to DEV@Deakin? <Link to="/register">Sign up</Link></p>
  </section>;
}
