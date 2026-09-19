import FeaturedCard from "./FeaturedCard";

function FeaturedSection({ title, items, buttonText }) {
  return (
    <section className="featured-section">
      <h2>{title}</h2>

      <div className="cards-container">
        {items.map((item) => (
          <FeaturedCard
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <button className="secondary-button">
        {buttonText}
      </button>
    </section>
  );
}

export default FeaturedSection;