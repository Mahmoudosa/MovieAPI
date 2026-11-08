using Microsoft.AspNetCore.Mvc;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController: ControllerBase
{
    private static readonly List<Movie> movies =new()
    {
        new Movie { Id = 1, Title = "Inception", Director = "Christopher Nolan", ReleaseYear = 2010, Genre = "Drama" },
        new Movie { Id = 2, Title = "Avatar", Director = "James Cameron", ReleaseYear = 2009, Genre = "Sci-Fi" },
        new Movie { Id = 3, Title = "Titanic", Director = "James Cameron", ReleaseYear = 1997, Genre = "Romance" }
    };

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

}