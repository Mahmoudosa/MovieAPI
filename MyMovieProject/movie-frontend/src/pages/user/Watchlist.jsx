import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { useAppData } from '../../hooks/useAppData';

function Watchlist() {
  const { watchlist } = useAppData();

  return (
    <main className="content">
      <header className="page-header">
        <div>
          <span className="eyebrow">SAVED FOR LATER</span>
          <h1>My Watchlist</h1>
          <p>Your personal queue of movies to watch next.</p>
        </div>
        <span className="result-count">{watchlist.length} saved</span>
      </header>

      {watchlist.length ? (
        <div className="movies-grid">
          {watchlist.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      ) : (
        <section className="empty-state">
          <span className="empty-icon" aria-hidden="true">♡</span>
          <h2>Your watchlist is waiting</h2>
          <p>Save a movie that catches your eye and it will show up here.</p>
          <Link className="button button-primary" to="/movies">Explore Movies</Link>
        </section>
      )}
    </main>
  );
}

export default Watchlist;
