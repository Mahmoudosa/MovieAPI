import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { useAppData } from '../../hooks/useAppData';

function Movies() {
  const { movies } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const categories = [...new Set(movies.map((movie) => movie.categoryName))].sort();

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = movies.filter((movie) => {
      const matchesQuery = !normalizedQuery
        || movie.title.toLowerCase().includes(normalizedQuery)
        || movie.director.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'all' || movie.categoryName === category;
      return matchesQuery && matchesCategory;
    });

    return result.sort((first, second) => {
      switch (sortBy) {
        case 'title-desc':
          return second.title.localeCompare(first.title);
        case 'year-desc':
          return second.releaseYear - first.releaseYear;
        case 'year-asc':
          return first.releaseYear - second.releaseYear;
        default:
          return first.title.localeCompare(second.title);
      }
    });
  }, [movies, query, category, sortBy]);

  const clearFilters = () => {
    setCategory('all');
    setSortBy('title-asc');
    setSearchParams({});
  };

  return (
    <main className="content">
      <header className="page-header">
        <div>
          <span className="eyebrow">THE COLLECTION</span>
          <h1>Explore movies</h1>
          <p>Find your next favorite from our movie collection.</p>
        </div>
        <span className="result-count">{filteredMovies.length} titles</span>
      </header>

      <section className="filter-panel" aria-label="Movie search and filters">
        <div className="filter-search">
          <label htmlFor="movie-search">Search</label>
          <input
            id="movie-search"
            type="search"
            placeholder="Search title or director..."
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setSearchParams(nextQuery ? { search: nextQuery } : {});
            }}
          />
        </div>
        <div>
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort-movies">Sort by</label>
          <select id="sort-movies" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
            <option value="year-desc">Release year (newest)</option>
            <option value="year-asc">Release year (oldest)</option>
          </select>
        </div>
        <button className="button button-quiet clear-filters" onClick={clearFilters}>
          Clear filters
        </button>
      </section>

      {filteredMovies.length ? (
        <div className="movies-grid">
          {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      ) : (
        <section className="empty-state">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h2>No movies found</h2>
          <p>Try another title or director, or clear your filters.</p>
          <button className="button button-primary" onClick={clearFilters}>Clear filters</button>
        </section>
      )}
    </main>
  );
}

export default Movies;
