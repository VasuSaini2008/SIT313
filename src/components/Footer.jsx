import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <p>DEV@Deakin</p>
      <p>A community for Deakin students to connect, learn and share ideas.</p>

      <nav aria-label="Footer navigation">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <p>© 2026 DEV@Deakin. All rights reserved.</p>
    </footer>
  );
}