function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        🎬
      </div>

      <div className="movie-info">
        <span className="category">
          {movie.categoryName}
        </span>

        <h3>{movie.title}</h3>
        <p>{movie.director}</p>
        <p>{movie.releaseYear}</p>

        <button>View Details</button>
      </div>
    </div>
  );
}

export default MovieCard;