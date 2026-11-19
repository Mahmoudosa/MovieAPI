import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

function MovieDetails() {
  const { id } = useParams();
  const movieId = Number(id);
  const {
    catalogMovies: movies,
    catalogReviews: reviews,
    profile,
    watchlistIds,
    addToWatchlist,
    removeFromWatchlist,
    addReview
  } = useAppData();
  const movie = movies.find((item) => item.id === movieId);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const movieReviews = reviews.filter((review) => review.movieId === movieId);
  const isSaved = watchlistIds.includes(movieId);

  if (!movie) {
    return (
      <main className="content">
        <section className="empty-state">
          <h1>Movie not found</h1>
          <p>That title is not in the demo collection.</p>
          <Link className="button button-primary" to="/movies">Back to Movies</Link>
        </section>
      </main>
    );
  }

  const submitReview = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    const savedReview = await addReview({ movieId, rating, comment });
    if (!savedReview) return;
    setComment('');
    setReviewMessage('Your review has been saved.');
  };

  return (
    <main className="content">
      <Link className="back-link" to="/movies">← Back to Movies</Link>

      <section className="details-panel">
        <div className={`details-poster poster-${movie.posterTone}`}>
          <span aria-hidden="true">{movie.icon}</span>
          <span className="poster-year">{movie.releaseYear}</span>
        </div>
        <div className="details-copy">
          <span className="category">{movie.categoryName}</span>
          <h1>{movie.title}</h1>
          <p className="details-meta">Directed by <strong>{movie.director}</strong></p>
          <p className="details-meta">Released <strong>{movie.releaseYear}</strong></p>
          <p className="details-description">{movie.description || 'No description is available for this movie.'}</p>
          <div className="details-rating"><span aria-hidden="true">★</span> {movie.rating.toFixed(1)} <small>/ 5 community rating</small></div>
          <button
            className={`button button-primary${isSaved ? ' button-muted' : ''}`}
            onClick={() => (
              isSaved ? removeFromWatchlist(movieId) : addToWatchlist(movieId)
            )}
            aria-pressed={isSaved}
          >
            {isSaved ? '✓ In your Watchlist' : '＋ Add to Watchlist'}
          </button>
        </div>
      </section>

      <section className="details-reviews page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">COMMUNITY</span>
            <h2>Reviews <span className="subtle-count">({movieReviews.length})</span></h2>
          </div>
        </div>
        {movieReviews.length ? (
          <div className="review-list">
            {movieReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-heading">
                  <strong>{review.userName || profile.userName}</strong>
                  <span className="stars" aria-label={`${review.rating} out of 5 stars`}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No reviews yet. Be the first to share your thoughts.</p>
        )}

        <form className="review-form" onSubmit={submitReview}>
          <h3>Write a review</h3>
          <label htmlFor="review-rating">Your rating</label>
          <select id="review-rating" value={rating} onChange={(event) => setRating(event.target.value)}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>
            ))}
          </select>
          <label htmlFor="review-comment">Your review</label>
          <textarea
            id="review-comment"
            rows="4"
            maxLength="1000"
            placeholder="What did you think of the movie?"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
          />
          {reviewMessage && <p className="success-message" role="status">{reviewMessage}</p>}
          <button className="button button-primary" type="submit">Post Review</button>
        </form>
      </section>
    </main>
  );
}

export default MovieDetails;
