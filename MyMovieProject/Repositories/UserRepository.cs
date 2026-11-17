
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasReviewsAsync(int userId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.UserId == userId);
        }

        public async Task<bool> HasWatchlistsAsync(int userId)
        {
            return await _context.Watchlists
                .AnyAsync(w => w.UserId == userId);
        }

        public async Task<User?> GetByUserNameAndEmailAsync(
            string userName,
        string email)
        {
        return await _context.Users
            .FirstOrDefaultAsync(u =>
                u.UserName == userName &&
                u.Email == email);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        
        }
}
