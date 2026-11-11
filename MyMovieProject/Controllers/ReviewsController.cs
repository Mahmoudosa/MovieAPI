
using Microsoft.AspNetCore.Mvc;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewsController(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    // GET: api/reviews
    [HttpGet]
    public async Task<ActionResult> GetReviews()
    {
        var reviews = await _reviewRepository.GetAllAsync();

        var result = reviews.Select(r => new
        {
            r.Id,
            r.Rating,
            r.Comment,
            r.MovieId,
            MovieTitle = r.Movie.Title,
            r.UserId,
            UserName = r.User.UserName
        });

        return Ok(result);
    }

    // GET: api/reviews/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetReviewById(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        return Ok(new
        {
            review.Id,
            review.Rating,
            review.Comment,
            review.MovieId,
            MovieTitle = review.Movie.Title,
            review.UserId,
            UserName = review.User.UserName
        });
    }

    // POST: api/reviews
    [HttpPost]
    public async Task<ActionResult> AddReview(ReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        bool movieExists =
            await _reviewRepository.MovieExistsAsync(dto.MovieId);

        bool userExists =
            await _reviewRepository.UserExistsAsync(dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        var review = new Review
        {
            Rating = dto.Rating,
            Comment = dto.Comment,
            MovieId = dto.MovieId,
            UserId = dto.UserId
        };

        await _reviewRepository.AddAsync(review);

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

    // PUT: api/reviews/1
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateReview(
        int id, ReviewDto dto)
    {
        var review = await _reviewRepository.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        bool movieExists =
            await _reviewRepository.MovieExistsAsync(dto.MovieId);

        bool userExists =
            await _reviewRepository.UserExistsAsync(dto.UserId);

        if (!movieExists || !userExists)
            return BadRequest("Invalid MovieId or UserId.");

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        review.MovieId = dto.MovieId;
        review.UserId = dto.UserId;

        await _reviewRepository.SaveChangesAsync();

        return Ok(new
        {
            review.Id,
            review.Rating,
            review.Comment,
            review.MovieId,
            review.UserId
        });
    }

    // DELETE: api/reviews/1
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        await _reviewRepository.DeleteAsync(review);

        return NoContent();
    }
}
