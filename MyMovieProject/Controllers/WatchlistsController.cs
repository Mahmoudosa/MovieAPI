
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatchlistsController : ControllerBase
{
    private readonly IWatchlistRepository _watchlistRepository;

    public WatchlistsController(
        IWatchlistRepository watchlistRepository)
    {
        _watchlistRepository = watchlistRepository;
    }

    // GET: api/watchlists
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetWatchlists()
    {
        int? currentUserId = GetCurrentUserId();
        if (currentUserId is null)
            return Forbid();

        var watchlists = (await _watchlistRepository.GetAllAsync())
            .Where(w => w.UserId == currentUserId.Value);

        var result = watchlists.Select(w => new
        {
            w.Id,
            w.DateAdded,
            w.IsWatched,
            w.MovieId,
            MovieTitle = w.Movie.Title,
            w.UserId,
            UserName = w.User.UserName
        });

        return Ok(result);
    }

    // GET: api/watchlists/1
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult> GetWatchlistById(int id)
    {
        var watchlist = await _watchlistRepository.GetByIdAsync(id);

        if (watchlist == null)
            return NotFound();

        if (watchlist.UserId != GetCurrentUserId())
            return Forbid();

        return Ok(new
        {
            watchlist.Id,
            watchlist.DateAdded,
            watchlist.IsWatched,
            watchlist.MovieId,
            MovieTitle = watchlist.Movie.Title,
            watchlist.UserId,
            UserName = watchlist.User.UserName
        });
    }

    // POST: api/watchlists
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> AddWatchlist(WatchlistDto dto)
    {
        int? currentUserId = GetCurrentUserId();
        if (currentUserId is null || dto.UserId != currentUserId.Value)
            return Forbid();

        bool movieExists =
            await _watchlistRepository.MovieExistsAsync(dto.MovieId);

        bool userExists =
            await _watchlistRepository.UserExistsAsync(dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        bool alreadyAdded =
            await _watchlistRepository.IsDuplicateAsync(
                dto.MovieId, dto.UserId);

        if (alreadyAdded)
            return Conflict(
                "Movie is already in this user's watchlist.");

        var watchlist = new Watchlist
        {
            MovieId = dto.MovieId,
            UserId = dto.UserId,
            IsWatched = dto.IsWatched
        };

        await _watchlistRepository.AddAsync(watchlist);

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

    // PUT: api/watchlists/1
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateWatchlist(
        int id, WatchlistDto dto)
    {
        var watchlist =
            await _watchlistRepository.GetByIdAsync(id);

        if (watchlist == null)
            return NotFound();

        int? currentUserId = GetCurrentUserId();
        if (currentUserId is null ||
            watchlist.UserId != currentUserId.Value ||
            dto.UserId != currentUserId.Value)
            return Forbid();

        bool movieExists =
            await _watchlistRepository.MovieExistsAsync(dto.MovieId);

        bool userExists =
            await _watchlistRepository.UserExistsAsync(dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        bool duplicate =
            await _watchlistRepository.IsDuplicateAsync(
                dto.MovieId, dto.UserId, id);

        if (duplicate)
            return Conflict(
                "Movie is already in this user's watchlist.");

        watchlist.MovieId = dto.MovieId;
        watchlist.UserId = dto.UserId;
        watchlist.IsWatched = dto.IsWatched;

        await _watchlistRepository.SaveChangesAsync();

        return Ok(new
        {
            watchlist.Id,
            watchlist.MovieId,
            watchlist.UserId,
            watchlist.IsWatched,
            watchlist.DateAdded
        });
    }

    // DELETE: api/watchlists/1
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWatchlist(int id)
    {
        var watchlist =
            await _watchlistRepository.GetByIdAsync(id);

        if (watchlist == null)
            return NotFound();

        if (watchlist.UserId != GetCurrentUserId())
            return Forbid();

        await _watchlistRepository.DeleteAsync(watchlist);

        return NoContent();
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId) ? userId : null;
    }
}
