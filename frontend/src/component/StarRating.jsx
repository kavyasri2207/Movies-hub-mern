const StarRating = ({ rating, size = 18 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <span
        key={i}
        style={{ fontSize: size, color: filled ? "#f59e0b" : "#4b5563" }}
      >
        ★
      </span>
    );
  }
  return <span className="inline-flex">{stars}</span>;
};

export default StarRating;
