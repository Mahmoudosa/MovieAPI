import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';

function MovieCard({ movie, showWatchlistAction = true }) {
  const { watchlistIds, addToWatchlist, removeFromWatchlist } = useAppData();
  const isSaved = watchlistIds.includes(movie.id);

  return (
    <article className="movie-card">
      <div className={`movie-poster poster-${movie.posterTone || 'violet'}`}>
        <span aria-hidden="true">{movie.icon || '✦'}</span>
        <span className="poster-year">{movie.releaseYear}</span>
      </div>

      <div className="movie-info">
        <span className="category">{movie.categoryName}</span>
        <h3>{movie.title}</h3>
        <p>{movie.director}</p>
        <div className="movie-card-footer">
          <span className="movie-rating" aria-label={`Rating ${movie.rating} out of 5`}>
            ★ <span>{movie.rating.toFixed(1)}</span>
          </span>
          <span>{movie.releaseYear}</span>
        </div>
        <Link className="button button-secondary card-details" to={`/movies/${movie.id}`}>
          View Details
        </Link>
        {showWatchlistAction && (
          <button
            className={`button watchlist-action${isSaved ? ' is-saved' : ''}`}
            onClick={() => (
              isSaved ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id)
            )}
            aria-pressed={isSaved}
          >
            {isSaved ? 'Remove from Watchlist' : '＋ Add to Watchlist'}
          </button>
        )}
      </div>
    </article>
  );
}

export default MovieCard;