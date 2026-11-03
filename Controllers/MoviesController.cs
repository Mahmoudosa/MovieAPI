using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs;
using MovieApi.Models;

namespace MovieApi.Controllers;

[ApiController]
[Route("api/[controller]")]            // [controller] = "Movies"  →  /api/movies
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _db;

    public MoviesController(AppDbContext db) => _db = db;   // injected by DI

    // READ ALL: GET /api/movies
    [HttpGet]
    public async Task<ActionResult<List<MovieListItemDto>>> GetAll()
    {
        var movies = await _db.Movies
            .AsNoTracking()
            .OrderBy(m => m.Title)
            .Select(m => new MovieListItemDto(m.Id, m.Title, m.ReleaseYear, m.Genre, m.PosterUrl))
            .ToListAsync();

        return Ok(movies);
    }

    // READ ONE: GET /api/movies/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MovieDetailsDto>> GetById(int id)
    {
        var m = await _db.Movies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (m is null) return NotFound();

        return Ok(new MovieDetailsDto(m.Id, m.Title, m.Description, m.Genre,
                                      m.ReleaseYear, m.Director, m.PosterUrl));
    }

    // CREATE: POST /api/movies
    [HttpPost]
    public async Task<ActionResult<MovieDetailsDto>> Create(SaveMovieDto dto)
    {
        var movie = new Movie
        {
            Title = dto.Title,
            Description = dto.Description,
            Genre = dto.Genre,
            ReleaseYear = dto.ReleaseYear,
            Director = dto.Director,
            PosterUrl = dto.PosterUrl
        };

        _db.Movies.Add(movie);
        await _db.SaveChangesAsync();          // INSERT happens here; movie.Id is now filled

        var result = new MovieDetailsDto(movie.Id, movie.Title, movie.Description, movie.Genre,
                                         movie.ReleaseYear, movie.Director, movie.PosterUrl);

        return CreatedAtAction(nameof(GetById), new { id = movie.Id }, result);   // 201 + Location header
    }

    // UPDATE: PUT /api/movies/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, SaveMovieDto dto)
    {
        var movie = await _db.Movies.FindAsync(id);
        if (movie is null) return NotFound();

        movie.Title = dto.Title;
        movie.Description = dto.Description;
        movie.Genre = dto.Genre;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.Director = dto.Director;
        movie.PosterUrl = dto.PosterUrl;

        await _db.SaveChangesAsync();          // EF detects the changes and runs UPDATE
        return NoContent();                    // 204: success, nothing to return
    }

    // DELETE: DELETE /api/movies/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var movie = await _db.Movies.FindAsync(id);
        if (movie is null) return NotFound();

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}