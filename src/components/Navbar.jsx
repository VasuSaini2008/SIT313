import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="DEV at Deakin home">
        DEV@Deakin
      </Link>

      <form className="search" onSubmit={handleSearch} role="search">
        <input
          type="search"
          aria-label="Search posts"
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <nav className="nav-actions" aria-label="Main navigation">
        <NavLink to="/" className="nav-link">
          Post
        </NavLink>
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
      </nav>
    </header>
  );
}