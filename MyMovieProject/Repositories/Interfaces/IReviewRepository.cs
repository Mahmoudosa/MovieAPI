
using MyMovieApp.Models;

namespace MyMovieApp.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<List<Review>> GetAllAsync();

        Task<Review?> GetByIdAsync(int id);

        Task<bool> MovieExistsAsync(int movieId);

        Task<bool> UserExistsAsync(int userId);

        Task AddAsync(Review review);

        Task SaveChangesAsync();

        Task DeleteAsync(Review review);
    }
}
