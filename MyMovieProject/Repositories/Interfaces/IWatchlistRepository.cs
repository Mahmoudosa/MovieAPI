
using MyMovieApp.Models;

namespace MyMovieApp.Repositories.Interfaces
{
    public interface IWatchlistRepository
    {
        Task<List<Watchlist>> GetAllAsync();

        Task<Watchlist?> GetByIdAsync(int id);

        Task<bool> MovieExistsAsync(int movieId);

        Task<bool> UserExistsAsync(int userId);

        Task<bool> IsDuplicateAsync(
            int movieId,
            int userId,
            int? excludeId = null);

        Task AddAsync(Watchlist watchlist);

        Task SaveChangesAsync();

        Task DeleteAsync(Watchlist watchlist);
    }
}
