import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
export default function Home() {
  const { user, profileName, signOutUser } = useAuth();
  return <section className="home-card">
    <p className="eyebrow">DEV@Deakin community</p>
    <h1>Ideas grow when we share them.</h1>
    <p className="lead">A place for Deakin students to connect, learn and build together.</p>
    {user ? <div className="signed-in"><p>Signed in as <strong>{profileName || user.email}</strong></p><button className="button secondary" onClick={signOutUser}>Log out</button></div> : <div className="home-actions"><Link className="button" to="/login">Login</Link><Link className="button secondary" to="/register">Create an account</Link></div>}
  </section>;
}
