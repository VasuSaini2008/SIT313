
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Home() {
  const { user, profileName, signOutUser } = useAuth();

  return (
    <section className="home-card">
      <p className="eyebrow">DEV@Deakin Community</p>

      <h1>Ideas grow when we share them.</h1>

      <p className="lead">
        A place for Deakin students to connect, learn and build together.
      </p>

      <div className="hero-actions">
        {user ? (
          <>
            <p>
              Signed in as <strong>{profileName || user.email}</strong>
            </p>
            <button
              className="button secondary"
              onClick={signOutUser}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="button" to="/login">
              Login
            </Link>

            <Link className="button secondary" to="/register">
              Create an account
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
