import MovieCard from '../components/MovieCard';

function Home() {
  const movies = [
    {
      id: 1,
      title: 'Inception',
      director: 'Christopher Nolan',
      releaseYear: 2010,
      categoryName: 'Sci-Fi'
    },
    {
      id: 2,
      title: 'Interstellar',
      director: 'Christopher Nolan',
      releaseYear: 2014,
      categoryName: 'Sci-Fi'
    },
    {
      id: 3,
      title: 'The Dark Knight',
      director: 'Christopher Nolan',
      releaseYear: 2008,
      categoryName: 'Action'
    }
  ];

  return (
    <main className="content">
      <section className="hero">
        <span>YOUR MOVIE COLLECTION</span>
        <h1>Discover Your Next Favorite Movie</h1>
        <p>
          Explore movies, write reviews and build your watchlist.
        </p>
        <button>Explore Movies</button>
      </section>

      <section className="movies-section">
        <div className="section-header">
          <h2>All Movies</h2>
          <button>+ Add Movie</button>
        </div>

        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;