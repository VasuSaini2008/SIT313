function FeaturedCard({ item }) {
  return (
    <article className="card">
      <img
        src={item.image}
        alt={item.title}
        className="card-image"
      />

      <div className="card-content">
        <h3>{item.title}</h3>

        <p className="description">
          {item.description}
        </p>

        <p className="category">
          e.g., {item.category}
        </p>

        <div className="rating">
          <span className="stars">
            {"★".repeat(Math.floor(item.rating))}
          </span>

          <span className="rating-number">
            {item.rating}
          </span>
        </div>

        <p className="author">
          {item.author}'s name
        </p>
      </div>
    </article>
  );
}

export default FeaturedCard;