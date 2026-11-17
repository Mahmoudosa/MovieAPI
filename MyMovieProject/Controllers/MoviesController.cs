
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IMemoryCache _memoryCache;

    private const string MoviesCacheKey = "movies_all";

    public MoviesController(
        IMovieRepository movieRepository,
        IMemoryCache memoryCache)
    {
        _movieRepository = movieRepository;
        _memoryCache = memoryCache;
    }

    // GET: api/movies
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetMovies()
    {
        // 1. Check cache
        if (_memoryCache.TryGetValue(
            MoviesCacheKey,
            out object? cachedMovies)
            && cachedMovies != null)
        {
            Console.WriteLine("CACHE HIT - All Movies");

            return Ok(cachedMovies);
        }

        Console.WriteLine("CACHE MISS - All Movies");

        // 2. Get movies from database
        var movies = await _movieRepository.GetAllAsync();

        // 3. Convert movies to response objects
        var result = movies.Select(m => new
        {
            m.Id,
            m.Title,
            m.Director,
            m.ReleaseYear,
            m.CategoryId,
            CategoryName = m.Category.Name
        }).ToList();

        // 4. Store result in cache for 5 minutes
        _memoryCache.Set(
            MoviesCacheKey,
            result,
            TimeSpan.FromMinutes(5)
        );

        return Ok(result);
    }

    // GET: api/movies/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        string cacheKey = $"movie_{id}";

        // 1. Check cache
        if (_memoryCache.TryGetValue(
            cacheKey,
            out object? cachedMovie)
            && cachedMovie != null)
        {
            Console.WriteLine($"CACHE HIT - Movie {id}");

            return Ok(cachedMovie);
        }

        Console.WriteLine($"CACHE MISS - Movie {id}");

        // 2. Get movie from database
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        // 3. Create response object
        var result = new
        {
            movie.Id,
            movie.Title,
            movie.Director,
            movie.ReleaseYear,
            movie.CategoryId,
            CategoryName = movie.Category.Name
        };

        // 4. Store movie in cache
        _memoryCache.Set(
            cacheKey,
            result,
            TimeSpan.FromMinutes(5)
        );

        return Ok(result);
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult> AddMovie(MovieDto dto)
    {
        bool categoryExists =
            await _movieRepository.CategoryExistsAsync(
                dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        var movie = new Movie
        {
            Title = dto.Title,
            Director = dto.Director,
            ReleaseYear = dto.ReleaseYear,
            CategoryId = dto.CategoryId
        };

        // Save new movie
        await _movieRepository.AddAsync(movie);

        // Remove old movies list from cache
        _memoryCache.Remove(MoviesCacheKey);

        return CreatedAtAction(
            nameof(GetMovieById),
            new { id = movie.Id },
            new
            {
                movie.Id,
                movie.Title,
                movie.Director,
                movie.ReleaseYear,
                movie.CategoryId
            });
    }

    // PUT: api/movies/1
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMovie(
        int id,
        MovieDto dto)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        bool categoryExists =
            await _movieRepository.CategoryExistsAsync(
                dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        // Update movie properties
        movie.Title = dto.Title;
        movie.Director = dto.Director;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.CategoryId = dto.CategoryId;

        // Save changes
        await _movieRepository.UpdateAsync(movie);

        // Invalidate affected cache entries
        _memoryCache.Remove(MoviesCacheKey);
        _memoryCache.Remove($"movie_{id}");

        return Ok(new
        {
            movie.Id,
            movie.Title,
            movie.Director,
            movie.ReleaseYear,
            movie.CategoryId
        });
    }

    // DELETE: api/movies/1
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMovie(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        // Delete movie from database
        await _movieRepository.DeleteAsync(movie);

        // Invalidate affected cache entries
        _memoryCache.Remove(MoviesCacheKey);
        _memoryCache.Remove($"movie_{id}");

        return NoContent();
    }
}
