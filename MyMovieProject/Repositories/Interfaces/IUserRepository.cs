
using MyMovieApp.Models;

namespace MyMovieApp.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();

        Task<User?> GetByIdAsync(int id);

        Task AddAsync(User user);

        Task SaveChangesAsync();

        Task DeleteAsync(User user);

        Task<bool> HasReviewsAsync(int userId);

        Task<bool> HasWatchlistsAsync(int userId);
    }
}
