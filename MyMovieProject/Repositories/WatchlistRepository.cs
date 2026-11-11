
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Repositories
{
    public class WatchlistRepository : IWatchlistRepository
    {
        private readonly AppDbContext _context;

        public WatchlistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Watchlist>> GetAllAsync()
        {
            return await _context.Watchlists
                .Include(w => w.Movie)
                .Include(w => w.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Watchlist?> GetByIdAsync(int id)
        {
            return await _context.Watchlists
                .Include(w => w.Movie)
                .Include(w => w.User)
                .FirstOrDefaultAsync(w => w.Id == id);
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

        public async Task<bool> IsDuplicateAsync(
            int movieId,
            int userId,
            int? excludeId = null)
        {
            return await _context.Watchlists
                .AnyAsync(w =>
                    w.MovieId == movieId &&
                    w.UserId == userId &&
                    (!excludeId.HasValue || w.Id != excludeId.Value));
        }

        public async Task AddAsync(Watchlist watchlist)
        {
            _context.Watchlists.Add(watchlist);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Watchlist watchlist)
        {
            _context.Watchlists.Remove(watchlist);
            await _context.SaveChangesAsync();
        }
    }
}
