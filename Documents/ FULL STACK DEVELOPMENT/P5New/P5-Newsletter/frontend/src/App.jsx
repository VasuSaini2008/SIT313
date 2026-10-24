
import React from "react";
import { Bookmark } from "lucide-react";
import Newsletter from "./components/Newsletter.jsx";

const posts = [
  {
    title: "Getting started with web development",
    description: "Learn the basics of building modern websites.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Building with React",
    description: "Create interactive interfaces with components.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
  }
];

export default function App() {
  return (
    <div className="site">
      <header className="navbar">
        <a className="brand" href="#" aria-label="DEV at Deakin home">
          DEV@Deakin
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#posts">Posts</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <h1>Discover. Create. Share.</h1>
          <p>Explore projects, ideas and stories from the DEV@Deakin community.</p>
        </section>

        <section className="posts-section" id="posts">
          <h2>Latest Posts</h2>

          <div className="post-grid">
            {posts.map((post, index) => (
              <article className="post-card" key={post.title}>
                <img
                  className="post-image"
                  src={post.image}
                  alt=""
                />
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </div>
                {index === 0 && (
                  <span className="bookmark" aria-label="Saved post">
                    <Bookmark size={18} />
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        <Newsletter />
      </main>

      <footer className="footer" id="about">
        DEV@Deakin · Share your ideas with the community
      </footer>
    </div>
  );
}
