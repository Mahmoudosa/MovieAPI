
using MyMovieApp.Models;

namespace MyMovieApp.Repositories.Interfaces
{
    public interface IMovieRepository
    {
        Task<List<Movie>> GetAllAsync();

        Task<Movie?> GetByIdAsync(int id);
        Task<bool> CategoryExistsAsync(int categoryId);

        Task AddAsync(Movie movie);

        Task UpdateAsync(Movie movie);

        Task DeleteAsync(Movie movie);
        Task<(List<Movie> Movies, int TotalCount)> SearchAsync(
        string? search,
        int? categoryId,
        int page,
        int pageSize);
    }
}
