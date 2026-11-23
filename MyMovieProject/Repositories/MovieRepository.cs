
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Repositories
{
    public class MovieRepository : IMovieRepository
    {
        private readonly AppDbContext _context;

        public MovieRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Movie>> GetAllAsync()
        {
            return await _context.Movies
                .Include(m => m.Category)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Movie?> GetByIdAsync(int id)
        {
            return await _context.Movies
                .Include(m => m.Category)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories
                .AnyAsync(c => c.Id == categoryId);
        }

        public async Task AddAsync(Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Movie movie)
        {
            // Movie is already tracked by EF Core
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Movie movie)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        // Search, filter, and paginate movies
        public async Task<(List<Movie> Movies, int TotalCount)> SearchAsync(
            string? search,
            int? categoryId,
            int page,
            int pageSize)
        {
            IQueryable<Movie> query = _context.Movies
                .Include(m => m.Category)
                .AsNoTracking();

            // 1. Search anywhere in the movie title
            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchTerm = search.Trim();

                query = query.Where(m =>
                    m.Title.Contains(searchTerm));
            }

            // 2. Filter by category
            if (categoryId.HasValue)
            {
                query = query.Where(m =>
                    m.CategoryId == categoryId.Value);
            }

            // 3. Count all matching movies BEFORE pagination
            int totalCount = await query.CountAsync();

            // 4. Sort and retrieve only the requested page
            List<Movie> movies = await query
                .OrderBy(m => m.Title)
                .ThenBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // 5. Return both results
            return (movies, totalCount);
        }
    }
}
