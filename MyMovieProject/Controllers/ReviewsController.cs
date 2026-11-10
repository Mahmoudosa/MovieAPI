
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Data;
using MyMovieApp.DTOs;
using MyMovieApp.Models;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetReviews()
    {
        var reviews = await _context.Reviews
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.MovieId,
                MovieTitle = r.Movie.Title,
                r.UserId,
                UserName = r.User.UserName
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetReviewById(int id)
    {
        var review = await _context.Reviews
            .Where(r => r.Id == id)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.MovieId,
                MovieTitle = r.Movie.Title,
                r.UserId,
                UserName = r.User.UserName
            })
            .FirstOrDefaultAsync();

        if (review == null)
            return NotFound();

        return Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult> AddReview(ReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        bool movieExists = await _context.Movies
            .AnyAsync(m => m.Id == dto.MovieId);

        bool userExists = await _context.Users
            .AnyAsync(u => u.Id == dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        var review = new Review
        {
            Rating = dto.Rating,
            Comment = dto.Comment,
            MovieId = dto.MovieId,
            UserId = dto.UserId
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetReviewById),
            new { id = review.Id },
            new
            {
                review.Id,
                review.Rating,
                review.Comment,
                review.MovieId,
                review.UserId
            });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateReview(
        int id, ReviewDto dto)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return NotFound();

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        bool movieExists = await _context.Movies
            .AnyAsync(m => m.Id == dto.MovieId);

        bool userExists = await _context.Users
            .AnyAsync(u => u.Id == dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        review.MovieId = dto.MovieId;
        review.UserId = dto.UserId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            review.Id,
            review.Rating,
            review.Comment,
            review.MovieId,
            review.UserId
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
