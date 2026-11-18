import { useMemo, useState } from 'react';
import { useAppData } from '../../hooks/useAppData';

function ModerateReviews() {
  const { movies, users, reviews, deleteAdminReview } = useAppData();
  const [ratingFilter, setRatingFilter] = useState('all');
  const [message, setMessage] = useState('');
  const visibleReviews = useMemo(() => [...reviews]
    .filter((review) => ratingFilter === 'all' || review.rating === Number(ratingFilter))
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)),
  [reviews, ratingFilter]);

  const removeReview = (review) => {
    const movie = movies.find((item) => item.id === review.movieId);
    if (!window.confirm(`Delete this review for "${movie?.title || 'unknown movie'}"?`)) return;
    deleteAdminReview(review.id);
    setMessage('Review removed from demo moderation data.');
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">COMMUNITY</span><h1>Moderate reviews</h1><p>Review and remove demo community feedback.</p></div>
        <span className="result-count">{reviews.length} reviews</span>
      </header>
      <p className="demo-data-notice">Demo moderation only: removing a review updates local browser data and does not affect the API.</p>
      {message && <p className="success-message" role="status">{message}</p>}
      <section className="admin-panel">
        <div className="admin-toolbar">
          <div><span className="eyebrow">REVIEW QUEUE</span><h2>{visibleReviews.length} reviews</h2></div>
          <div><label className="visually-hidden" htmlFor="review-rating-filter">Filter by rating</label><select className="toolbar-select" id="review-rating-filter" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}><option value="all">All ratings</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></div>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead><tr><th>Movie</th><th>User</th><th>Rating</th><th>Comment</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {visibleReviews.map((review) => {
                const movie = movies.find((item) => item.id === review.movieId);
                const user = users.find((item) => item.id === review.userId);
                return (
                  <tr key={review.id}>
                    <td><strong>{movie?.title || 'Movie removed'}</strong></td>
                    <td>{review.userName || user?.userName || 'Demo user'}</td>
                    <td><span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></td>
                    <td className="review-table-comment">{review.comment}</td>
                    <td className="table-secondary">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td><button className="table-action danger" onClick={() => removeReview(review)}>Delete</button></td>
                  </tr>
                );
              })}
              {!visibleReviews.length && <tr><td colSpan="6" className="table-empty">No reviews match this rating.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ModerateReviews;
