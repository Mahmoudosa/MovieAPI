
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;
using MyMovieApp.Configuration;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IDistributedCache _cache;
    private readonly IOptionsMonitor<FeatureFlags> _featureFlags;

    private const string MoviesCacheKey = "movies_all";

    public MoviesController(
        IMovieRepository movieRepository,
        IDistributedCache cache,
        IOptionsMonitor<FeatureFlags> featureFlags)
    {
        _movieRepository = movieRepository;
        _cache = cache;
        _featureFlags = featureFlags;
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
            CategoryName = m.Category.Name ,
            Description = m.Description,
            OwnerUserId = m.OwnerUserId
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

    
    // GET: api/movies/search
    [Authorize(Roles = UserRoles.MovieManagers)]
    [HttpGet("search")]
    public async Task<ActionResult> SearchMovies(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (!_featureFlags.CurrentValue.EnableMovieSearch)
            return FeatureDisabled(
                nameof(FeatureFlags.EnableMovieSearch),
                "Movie search is currently disabled.");

        // 1. Validate pagination parameters
        if (page < 1)
            return BadRequest("Page must be at least 1.");

        if (pageSize < 1 || pageSize > 100)
            return BadRequest("PageSize must be between 1 and 100.");

        // 2. Call repository
        int? ownerUserId = User.IsInRole(UserRoles.Author)
            ? GetCurrentUserId()
            : null;
        if (User.IsInRole(UserRoles.Author) && ownerUserId is null)
            return Forbid();

        var (movies, totalCount) =
            await _movieRepository.SearchAsync(
                search,
                categoryId,
                page,
                pageSize,
                ownerUserId);

        // 3. Convert Movie entities to DTOs
        var movieDtos = movies.Select(m => new MovieResponseDto
        {
            Id = m.Id,
            Title = m.Title,
            Director = m.Director,
            ReleaseYear = m.ReleaseYear,
            CategoryId = m.CategoryId,
            CategoryName = m.Category.Name,
            Description = m.Description,
            OwnerUserId = m.OwnerUserId
        }).ToList();

        // 4. Calculate number of pages
        int totalPages = (int)Math.Ceiling(
            (double)totalCount / pageSize);

        // 5. Return pagination information
        return Ok(new
        {
            Items = movieDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages
        });
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
            CategoryName = movie.Category.Name,
            Description = movie.Description,
            OwnerUserId = movie.OwnerUserId
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
    [Authorize(Roles = UserRoles.MovieManagers)]
    [HttpPost]
    public async Task<ActionResult> AddMovie(MovieDto dto)
    {
        if (!_featureFlags.CurrentValue.EnableMovieCreation)
            return FeatureDisabled(
                nameof(FeatureFlags.EnableMovieCreation),
                "Movie creation is currently disabled.");

        int? ownerUserId = GetCurrentUserId();
        if (ownerUserId is null)
            return Forbid();

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
            CategoryId = dto.CategoryId,
            Description = dto.Description,
            OwnerUserId = ownerUserId
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
                movie.CategoryId,
                movie.Description,
                movie.OwnerUserId
            });
    }

    // PUT: api/movies/1
    [Authorize(Roles = UserRoles.MovieManagers)]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMovie(
        int id,
        MovieDto dto)
    {
        if (!_featureFlags.CurrentValue.EnableMovieUpdates)
            return FeatureDisabled(
                nameof(FeatureFlags.EnableMovieUpdates),
                "Movie updates are currently disabled.");

        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        if (!CanManageMovie(movie))
            return Forbid();

        bool categoryExists =
            await _movieRepository.CategoryExistsAsync(
                dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        movie.Title = dto.Title;
        movie.Director = dto.Director;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.CategoryId = dto.CategoryId;
        movie.Description = dto.Description;

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
            movie.CategoryId,
            movie.Description,
            movie.OwnerUserId
        });
    }

    // DELETE: api/movies/1
    [Authorize(Roles = UserRoles.MovieManagers)]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMovie(int id)
    {
        if (!_featureFlags.CurrentValue.EnableMovieDeletion)
            return FeatureDisabled(
                nameof(FeatureFlags.EnableMovieDeletion),
                "Movie deletion is currently disabled.");

        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        if (!CanManageMovie(movie))
            return Forbid();

        await _movieRepository.DeleteAsync(movie);

        // Invalidate Redis cache
        await _cache.RemoveAsync(MoviesCacheKey);
        await _cache.RemoveAsync($"movie_{id}");

        return NoContent();
    }

    private ObjectResult FeatureDisabled(string feature, string message) =>
        StatusCode(
            StatusCodes.Status503ServiceUnavailable,
            new { message, feature });

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId) ? userId : null;
    }

    private bool CanManageMovie(Movie movie) =>
        User.IsInRole(UserRoles.Admin) ||
        (User.IsInRole(UserRoles.Author) &&
         movie.OwnerUserId == GetCurrentUserId());
}
