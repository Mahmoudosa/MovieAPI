
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.DTOs;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatchlistsController : ControllerBase
{
    private readonly AppDbContext _context;

    public WatchlistsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetWatchlists()
    {
        var watchlists = await _context.Watchlists
            .Select(w => new
            {
                w.Id,
                w.DateAdded,
                w.IsWatched,
                w.MovieId,
                MovieTitle = w.Movie.Title,
                w.UserId,
                UserName = w.User.UserName
            })
            .ToListAsync();

        return Ok(watchlists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetWatchlistById(int id)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == id)
            .Select(w => new
            {
                w.Id,
                w.DateAdded,
                w.IsWatched,
                w.MovieId,
                MovieTitle = w.Movie.Title,
                w.UserId,
                UserName = w.User.UserName
            })
            .FirstOrDefaultAsync();

        if (watchlist == null)
            return NotFound();

        return Ok(watchlist);
    }

    [HttpPost]
    public async Task<ActionResult> AddWatchlist(WatchlistDto dto)
    {
        bool movieExists = await _context.Movies
            .AnyAsync(m => m.Id == dto.MovieId);

        bool userExists = await _context.Users
            .AnyAsync(u => u.Id == dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        bool alreadyAdded = await _context.Watchlists
            .AnyAsync(w => w.MovieId == dto.MovieId
                        && w.UserId == dto.UserId);

        if (alreadyAdded)
            return Conflict("Movie is already in this user's watchlist.");

        var watchlist = new Watchlist
        {
            MovieId = dto.MovieId,
            UserId = dto.UserId,
            IsWatched = dto.IsWatched
        };

        _context.Watchlists.Add(watchlist);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetWatchlistById),
            new { id = watchlist.Id },
            new
            {
                watchlist.Id,
                watchlist.MovieId,
                watchlist.UserId,
                watchlist.IsWatched,
                watchlist.DateAdded
            });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateWatchlist(
        int id, WatchlistDto dto)
    {
        var watchlist = await _context.Watchlists.FindAsync(id);

        if (watchlist == null)
            return NotFound();

        bool movieExists = await _context.Movies
            .AnyAsync(m => m.Id == dto.MovieId);

        bool userExists = await _context.Users
            .AnyAsync(u => u.Id == dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        bool duplicate = await _context.Watchlists
            .AnyAsync(w => w.Id != id
                        && w.MovieId == dto.MovieId
                        && w.UserId == dto.UserId);

        if (duplicate)
            return Conflict("Movie is already in this user's watchlist.");

        watchlist.MovieId = dto.MovieId;
        watchlist.UserId = dto.UserId;
        watchlist.IsWatched = dto.IsWatched;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            watchlist.Id,
            watchlist.MovieId,
            watchlist.UserId,
            watchlist.IsWatched,
            watchlist.DateAdded
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWatchlist(int id)
    {
        var watchlist = await _context.Watchlists.FindAsync(id);

        if (watchlist == null)
            return NotFound();

        _context.Watchlists.Remove(watchlist);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
