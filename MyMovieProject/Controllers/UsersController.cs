
using Microsoft.AspNetCore.Mvc;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _userRepository.GetAllAsync();

        var result = users.Select(u => new
        {
            u.Id,
            u.UserName,
            u.Email
        });

        return Ok(result);
    }

    // GET: api/users/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetUserById(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email
        });
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult> AddUser(UserDto dto)
    {
        var user = new User
        {
            UserName = dto.UserName,
            Email = dto.Email
        };

        await _userRepository.AddAsync(user);

        return CreatedAtAction(
            nameof(GetUserById),
            new { id = user.Id },
            new
            {
                user.Id,
                user.UserName,
                user.Email
            });
    }

    // PUT: api/users/1
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(
        int id, UserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        user.UserName = dto.UserName;
        user.Email = dto.Email;

        await _userRepository.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email
        });
    }

    // DELETE: api/users/1
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        bool hasReviews =
            await _userRepository.HasReviewsAsync(id);

        bool hasWatchlists =
            await _userRepository.HasWatchlistsAsync(id);

        if (hasReviews || hasWatchlists)
            return Conflict(
                "Cannot delete a user with reviews or watchlist entries.");

        await _userRepository.DeleteAsync(user);

        return NoContent();
    }
}
