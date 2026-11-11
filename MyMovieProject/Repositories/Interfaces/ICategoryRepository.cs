
using MyMovieApp.Models;

namespace MyMovieApp.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();

        Task<Category?> GetByIdAsync(int id);

        Task AddAsync(Category category);

        Task SaveChangesAsync();

        Task DeleteAsync(Category category);

        Task<bool> HasMoviesAsync(int categoryId);
    }
}
