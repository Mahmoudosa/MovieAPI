
using Microsoft.AspNetCore.Mvc;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;

    public MoviesController(IMovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
    }

    // GET: api/movies
    [HttpGet]
    public async Task<ActionResult> GetMovies()
    {
        var movies = await _movieRepository.GetAllAsync();

        var result = movies.Select(m => new
        {
            m.Id,
            m.Title,
            m.Director,
            m.ReleaseYear,
            m.CategoryId,
            CategoryName = m.Category.Name
        });

        return Ok(result);
    }

    // GET: api/movies/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        return Ok(new
        {
            movie.Id,
            movie.Title,
            movie.Director,
            movie.ReleaseYear,
            movie.CategoryId,
            CategoryName = movie.Category.Name
        });
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult> AddMovie(MovieDto dto)
    {
        bool categoryExists =
            await _movieRepository.CategoryExistsAsync(dto.CategoryId);

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
    public async Task<ActionResult> UpdateMovie(int id, MovieDto dto)
    {
        var movie = await _movieRepository.GetByIdAsync(id);

        if (movie == null)
            return NotFound();

        bool categoryExists =
            await _movieRepository.CategoryExistsAsync(dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        movie.Title = dto.Title;
        movie.Director = dto.Director;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.CategoryId = dto.CategoryId;

        await _movieRepository.UpdateAsync(movie);

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

        return NoContent();
    }
}
