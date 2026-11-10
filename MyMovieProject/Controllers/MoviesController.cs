
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.DTOs;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MoviesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetMovies()
    {
        var movies = await _context.Movies
            .Select(m => new
            {
                m.Id,
                m.Title,
                m.Director,
                m.ReleaseYear,
                m.CategoryId,
                CategoryName = m.Category.Name
            })
            .ToListAsync();

        return Ok(movies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        var movie = await _context.Movies
            .Where(m => m.Id == id)
            .Select(m => new
            {
                m.Id,
                m.Title,
                m.Director,
                m.ReleaseYear,
                m.CategoryId,
                CategoryName = m.Category.Name
            })
            .FirstOrDefaultAsync();

        if (movie == null)
            return NotFound();

        return Ok(movie);
    }

    [HttpPost]
    public async Task<ActionResult> AddMovie(MovieDto dto)
    {
        bool categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        var movie = new Movie
        {
            Title = dto.Title,
            Director = dto.Director,
            ReleaseYear = dto.ReleaseYear,
            CategoryId = dto.CategoryId
        };

        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMovieById),
            new { id = movie.Id },
            new { movie.Id, movie.Title, movie.Director,
                  movie.ReleaseYear, movie.CategoryId });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMovie(
        int id, MovieDto dto)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
            return NotFound();

        bool categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dto.CategoryId);

        if (!categoryExists)
            return BadRequest("Category does not exist.");

        movie.Title = dto.Title;
        movie.Director = dto.Director;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            movie.Id,
            movie.Title,
            movie.Director,
            movie.ReleaseYear,
            movie.CategoryId
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMovie(int id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
            return NotFound();

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
