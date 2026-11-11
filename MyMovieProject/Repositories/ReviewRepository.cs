
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetAllAsync()
        {
            return await _context.Reviews
                .Include(r => r.Movie)
                .Include(r => r.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Review?> GetByIdAsync(int id)
        {
            return await _context.Reviews
                .Include(r => r.Movie)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> MovieExistsAsync(int movieId)
        {
            return await _context.Movies
                .AnyAsync(m => m.Id == movieId);
        }

        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users
                .AnyAsync(u => u.Id == userId);
        }

        public async Task AddAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Review review)
        {
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }
    }
}
