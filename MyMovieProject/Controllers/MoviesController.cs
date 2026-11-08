using Microsoft.AspNetCore.Mvc;
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
    public ActionResult GetMovies()
    {
        var movies = _context.Movies
            .Select(m => new MovieListDto
            {
                Title = m.Title,
                Director = m.Director
            })
            .ToList();

        return Ok(movies);
    }
    
    [HttpGet("{id}")]
    public ActionResult GetMovieById(int id)
    {
        var movie = _context.Movies
            .Where(m => m.Id == id)
            .Select(m => new MovieDetailsDto
            {
                Title = m.Title,
                Director = m.Director,
                ReleaseYear = m.ReleaseYear,
                Genre = m.Genre
            })
            .FirstOrDefault();

        if (movie == null)
        {
            return NotFound();
        }

        return Ok(movie);
    }

    [HttpPost]
    public ActionResult AddMovie(Movie movie)
    {
        _context.Movies.Add(movie);
        _context.SaveChanges();
        return Ok(movie);
    }

    [HttpPut("{id}")]
    public ActionResult UpdateMovie(int id, Movie updatedMovie)
    {
        Movie movie = _context.Movies.FirstOrDefault(m => m.Id == id);

        if (movie == null)
        {
            return NotFound();
        }

        movie.Title = updatedMovie.Title;
        movie.Director = updatedMovie.Director;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.Genre = updatedMovie.Genre;

        _context.SaveChanges();

        return Ok(movie);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteMovie(int id)
    {
        Movie movie = _context.Movies.FirstOrDefault(m => m.Id == id);
        if (movie == null)
        {
            return NotFound();
        }
        _context.Movies.Remove(movie);
        _context.SaveChanges();
        return Ok();
    }

}