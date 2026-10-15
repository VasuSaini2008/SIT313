
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>DEV@Deakin</h3>
        <p>A community for sharing knowledge and ideas.</p>
      </div>

      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/new-post">Create a Post</Link>
      </div>

      <p className="copyright">
        © {new Date().getFullYear()} DEV@Deakin
      </p>
    </footer>
  );
}
