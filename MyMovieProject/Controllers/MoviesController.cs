using Microsoft.AspNetCore.Mvc;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController: ControllerBase
{
    private static readonly List<Movie> movies = new();

    [HttpGet]
    public ActionResult GetMovies()
    {
        return Ok(movies);
    }
    
    [HttpGet("{id}")]
    public ActionResult GetMovieById(int id)
    {
        Movie movie=movies.FirstOrDefault(m =>m.Id == id);
        if (movie == null)
        {
            return NotFound();
        }
        return Ok(movie);

    }

    [HttpPost]
    public ActionResult AddMovie(Movie movie)
    {
        movie.Id = movies.Count + 1;
        movies.Add(movie);
        return Ok(movie);
    }

    [HttpPut("{id}")]
    public ActionResult UpdateMovie(int id, Movie updatedMovie)
    {
        Movie movie = movies.FirstOrDefault(m => m.Id == id);
        if (movie == null)
        {
            return NotFound();
        }
        movie.Title = updatedMovie.Title;
        movie.Director = updatedMovie.Director;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.Genre = updatedMovie.Genre;
        return Ok(movie);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteMovie(int id)
    {
        Movie movie = movies.FirstOrDefault(m => m.Id == id);
        if (movie == null)
        {
            return NotFound();
        }
        movies.Remove(movie);
        return Ok();
    }

}