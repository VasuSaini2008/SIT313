
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <p className="eyebrow">DEV@Deakin Community</p>
        <h1>Learn. Share. Connect.</h1>
        <p>
          Ask questions, share articles, and learn with the
          student community.
        </p>
        <Link className="primary-link" to="/new-post">
          Create a Post
        </Link>
      </section>

      <section className="home-section">
        <h2>Share your knowledge</h2>
        <p>
          Have a question or an idea? Create a Question or
          publish an Article using the New Post page.
        </p>
      </section>
    </main>
  );
}
