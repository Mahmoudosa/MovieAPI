import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { useAppData } from '../../hooks/useAppData';

function MovieSection({ title, eyebrow, movies }) {
  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" to="/movies">Browse all <span aria-hidden="true">→</span></Link>
      </div>
      <div className="movies-grid">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}

function Home() {
  const { movies, profile } = useAppData();
  const featuredMovies = movies.slice(0, 3);
  const popularMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const recentMovies = [...movies]
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, 4);

  return (
    <main className="content">
      <section className="hero hero-dashboard">
        <div className="hero-copy">
          <span className="eyebrow">YOUR NEXT GREAT STORY STARTS HERE</span>
          <h1>Welcome back, {profile.userName}.</h1>
          <p>Find something worth watching, keep track of your favorites, and share what you think.</p>
          <Link className="button button-primary hero-button" to="/movies">
            Explore Movies <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit orbit-one" />
          <span className="hero-orbit orbit-two" />
          <span className="hero-reel">✦</span>
          <span className="hero-caption">YOUR PERSONAL<br />CINEMA</span>
        </div>
      </section>

      <MovieSection title="Featured movies" eyebrow="HAND-PICKED FOR YOU" movies={featuredMovies} />
      <MovieSection title="Popular right now" eyebrow="COMMUNITY FAVORITES" movies={popularMovies} />
      <MovieSection title="Recently added" eyebrow="FRESH TO YOUR COLLECTION" movies={recentMovies} />
    </main>
  );
}

export default Home;
