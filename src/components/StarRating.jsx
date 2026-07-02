import './StarRating.css';

/**
 * Renders a rounded star rating plus the review count.
 * Purely presentational — receives the `rating` object from the API
 * shape: { rate: number, count: number }.
 */
export default function StarRating({ rating }) {
  if (!rating) return null;
  const rounded = Math.round(rating.rate);

  return (
    <div className="star-rating" aria-label={`Rated ${rating.rate} out of 5, ${rating.count} reviews`}>
      <span aria-hidden="true" className="star-rating__stars">
        {'★'.repeat(rounded)}
        {'☆'.repeat(5 - rounded)}
      </span>
      <span className="star-rating__count">({rating.count})</span>
    </div>
  );
}
