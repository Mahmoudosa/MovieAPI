
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IDistributedCache _cache;

    private const string MoviesCacheKey = "movies_all";

    public MoviesController(
        IMovieRepository movieRepository,
        IDistributedCache cache)
    {
        _movieRepository = movieRepository;
        _cache = cache;
    }

    // GET: api/movies
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetMovies()
    {
        // 1. Check Redis
        var cachedMovies = await _cache.GetStringAsync(
            MoviesCacheKey);

        if (cachedMovies != null)
        {
            Console.WriteLine("REDIS CACHE HIT - All Movies");

            var result = JsonSerializer.Deserialize<
                List<MovieResponseDto>>(cachedMovies);

            return Ok(result);
        }

        Console.WriteLine("REDIS CACHE MISS - All Movies");

        // 2. Query SQL Server
        var movies = await _movieRepository.GetAllAsync();

        var resultFromDb = movies.Select(m => new MovieResponseDto
        {
            Id = m.Id,
            Title = m.Title,
            Director = m.Director,
            ReleaseYear = m.ReleaseYear,
            CategoryId = m.CategoryId,
            CategoryName = m.Category.Name
        }).ToList();

        // 3. Save JSON to Redis
        await _cache.SetStringAsync(
            MoviesCacheKey,
            JsonSerializer.Serialize(resultFromDb),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow =
                    TimeSpan.FromMinutes(5)
            });

        return Ok(resultFromDb);
    }

    // GET: api/movies/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        string cacheKey = $"movie_{id}";

        // 1. Check Redis
        var cachedMovie = await _cache.GetStringAsync(cacheKey);

        if (cachedMovie != null)
        {
            Console.WriteLine($"REDIS CACHE HIT - Movie {id}");

            var result = JsonSerializer.Deserialize<
                MovieResponseDto>(cachedMovie);

            return Ok(result);
        }

        Console.WriteLine($"REDIS CACHE MISS - Movie {id}");

        // 2. Query SQL Server
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        var resultFromDb = new MovieResponseDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Director = movie.Director,
            ReleaseYear = movie.ReleaseYear,
            CategoryId = movie.CategoryId,
            CategoryName = movie.Category.Name
        };

        // 3. Save to Redis
        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(resultFromDb),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow =
                    TimeSpan.FromMinutes(5)
            });

        return Ok(resultFromDb);
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

        await _movieRepository.AddAsync(movie);

        // Invalidate Redis list cache
        await _cache.RemoveAsync(MoviesCacheKey);

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

        movie.Title = dto.Title;
        movie.Director = dto.Director;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.CategoryId = dto.CategoryId;

        await _movieRepository.UpdateAsync(movie);

        // Invalidate Redis cache
        await _cache.RemoveAsync(MoviesCacheKey);
        await _cache.RemoveAsync($"movie_{id}");

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

        await _movieRepository.DeleteAsync(movie);

        // Invalidate Redis cache
        await _cache.RemoveAsync(MoviesCacheKey);
        await _cache.RemoveAsync($"movie_{id}");

        return NoContent();
    }
}
