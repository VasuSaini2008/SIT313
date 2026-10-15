
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        DEV@Deakin
      </Link>

      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          alert("Search functionality can be added in a future task.");
        }}
      >
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
        />
        <button type="submit">Search</button>
      </form>

      <nav className="nav-links">
        <NavLink to="/new-post">Post</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register" className="register-link">
          Register
        </NavLink>
      </nav>
    </header>
  );
}
