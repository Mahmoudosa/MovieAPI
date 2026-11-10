using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.DTOs;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController: ControllerBase
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
            .Select(m => new MovieListDto
            {
                Title = m.Title,
                Director = m.Director
            })
            .ToListAsync();
    
        return Ok(movies);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        var movie = await _context.Movies
            .Where(m => m.Id == id)
            .Select(m => new MovieDetailsDto
            {
                Title = m.Title,
                Director = m.Director,
                ReleaseYear = m.ReleaseYear,
                Genre = m.Genre
            })
            .FirstOrDefaultAsync();

        if (movie == null)
        {
            return NotFound();
        }

        return Ok(movie);
    }

    [HttpPost]
    public async Task<ActionResult> AddMovie(Movie movie)
    {
        await _context.Movies.AddAsync(movie);
        await _context.SaveChangesAsync();
        return Ok(movie);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMovie(int id, Movie updatedMovie)
    {
        Movie movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);

        if (movie == null)
        {
            return NotFound();
        }

        movie.Title = updatedMovie.Title;
        movie.Director = updatedMovie.Director;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.Genre = updatedMovie.Genre;

        await _context.SaveChangesAsync();

        return Ok(movie);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMovie(int id)
    {
        Movie movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);
        if (movie == null)
        {
            return NotFound();
        }
        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
        return Ok();
    }

}