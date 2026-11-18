import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

function MyReviews() {
  const { movies, reviews, profile, updateReview, deleteReview } = useAppData();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');
  const sortedReviews = reviews.filter((review) => (
    review.userId === 1 || review.userName === profile.userName
  )).sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt)
  );

  const beginEdit = (review) => {
    setEditingId(review.id);
    setDraft({ rating: review.rating, comment: review.comment });
    setMessage('');
  };

  const saveEdit = (event, reviewId) => {
    event.preventDefault();
    if (!draft.comment.trim()) return;
    updateReview(reviewId, draft);
    setEditingId(null);
    setMessage('Review updated.');
  };

  return (
    <main className="content">
      <header className="page-header">
        <div>
          <span className="eyebrow">YOUR VOICE</span>
          <h1>My Reviews</h1>
          <p>All the thoughts and ratings you have shared.</p>
        </div>
        <span className="result-count">{reviews.length} reviews</span>
      </header>

      {message && <p className="success-message" role="status">{message}</p>}

      {sortedReviews.length ? (
        <div className="review-list">
          {sortedReviews.map((review) => {
            const movie = movies.find((item) => item.id === review.movieId);
            if (!movie) return null;

            return (
              <article className="review-card review-manage-card" key={review.id}>
                <div className="review-card-heading">
                  <div>
                    <span className="eyebrow">{movie.categoryName} · {movie.releaseYear}</span>
                    <h2>{movie.title}</h2>
                  </div>
                  <span className="stars" aria-label={`${review.rating} out of 5 stars`}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>

                {editingId === review.id ? (
                  <form className="review-form compact-form" onSubmit={(event) => saveEdit(event, review.id)}>
                    <label htmlFor={`rating-${review.id}`}>Rating</label>
                    <select
                      id={`rating-${review.id}`}
                      value={draft.rating}
                      onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>{rating} stars</option>
                      ))}
                    </select>
                    <label htmlFor={`comment-${review.id}`}>Review</label>
                    <textarea
                      id={`comment-${review.id}`}
                      rows="3"
                      maxLength="1000"
                      value={draft.comment}
                      onChange={(event) => setDraft({ ...draft, comment: event.target.value })}
                      required
                    />
                    <div className="form-actions">
                      <button className="button button-primary" type="submit">Save Review</button>
                      <button className="button button-quiet" type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <div className="form-actions">
                      <Link className="button button-secondary" to={`/movies/${movie.id}`}>View Movie</Link>
                      <button className="button button-quiet" onClick={() => beginEdit(review)}>Edit Review</button>
                      <button
                        className="button button-danger-quiet"
                        onClick={() => {
                          deleteReview(review.id);
                          setMessage('Review deleted.');
                        }}
                      >
                        Delete Review
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <section className="empty-state">
          <span className="empty-icon" aria-hidden="true">✎</span>
          <h2>No reviews yet</h2>
          <p>Share your thoughts on a movie and your reviews will appear here.</p>
          <Link className="button button-primary" to="/movies">Find a Movie</Link>
        </section>
      )}
    </main>
  );
}

export default MyReviews;
