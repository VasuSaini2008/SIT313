import Header from "./components/Header";
import FeaturedSection from "./components/FeaturedSection";
import Footer from "./components/Footer";

function App() {
  const articles = [
    {
      id: 1,
      title: "Getting Started with React",
      description: "Learn the basic ideas behind React and how components work.",
      category: "React",
      author: "Alex",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Understanding NodeJS",
      description: "An introduction to NodeJS and its role in web development.",
      category: "NodeJS",
      author: "Sarah",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Useful React Hooks",
      description: "Explore some useful React Hooks for building applications.",
      category: "React Hooks",
      author: "Michael",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: "JavaScript Basics",
      description: "A simple tutorial for understanding modern JavaScript.",
      category: "JavaScript",
      author: "Emily",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Learning React Router",
      description: "Learn how to create different pages in a React application.",
      category: "React Router",
      author: "Daniel",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "ExpressJS Tutorial",
      description: "Understand the basic structure of an ExpressJS application.",
      category: "Express",
      author: "James",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="app">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-small">WELCOME TO DEV@DEAKIN</p>

            <h1>
              Learn. Create.
              <br />
              Share.
            </h1>

            <p>
              Discover useful articles and tutorials created by students and
              developers.
            </p>

            <button className="primary-button">
              Explore Content
            </button>
          </div>
        </section>

        <FeaturedSection
          title="Featured Articles"
          items={articles}
          buttonText="See all articles"
        />

        <FeaturedSection
          title="Featured Tutorials"
          items={tutorials}
          buttonText="See all tutorials"
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;