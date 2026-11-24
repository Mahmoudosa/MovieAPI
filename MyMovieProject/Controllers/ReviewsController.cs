
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;
using MyMovieApp.Configuration;
using Microsoft.Extensions.Options;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IOptionsMonitor<FeatureFlags> _featureFlags;

    public ReviewsController(
        IReviewRepository reviewRepository,
        IOptionsMonitor<FeatureFlags> featureFlags)
    {
        _reviewRepository = reviewRepository;
        _featureFlags = featureFlags;
    }

    // GET: api/reviews
    [HttpGet]
    public async Task<ActionResult> GetReviews()
    {
        if (!_featureFlags.CurrentValue.EnableMovieReviews)
            return ReviewsDisabled();

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
        if (!_featureFlags.CurrentValue.EnableMovieReviews)
            return ReviewsDisabled();

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
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> AddReview(ReviewDto dto)
    {
        if (!_featureFlags.CurrentValue.EnableMovieReviews)
            return ReviewsDisabled();

        int? currentUserId = GetCurrentUserId();
        if (currentUserId is null || dto.UserId != currentUserId.Value)
            return Forbid();

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
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateReview(
        int id, ReviewDto dto)
    {
        if (!_featureFlags.CurrentValue.EnableMovieReviews)
            return ReviewsDisabled();

        var review = await _reviewRepository.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        int? currentUserId = GetCurrentUserId();
        if (currentUserId is null ||
            review.UserId != currentUserId.Value ||
            dto.UserId != currentUserId.Value)
            return Forbid();

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
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        if (!_featureFlags.CurrentValue.EnableMovieReviews)
            return ReviewsDisabled();

        var review = await _reviewRepository.GetByIdAsync(id);

        if (review == null)
            return NotFound();

        if (review.UserId != GetCurrentUserId())
            return Forbid();

        await _reviewRepository.DeleteAsync(review);

        return NoContent();
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId) ? userId : null;
    }

    private ObjectResult ReviewsDisabled() =>
        StatusCode(
            StatusCodes.Status503ServiceUnavailable,
            new
            {
                message = "Movie reviews are currently disabled.",
                feature = nameof(FeatureFlags.EnableMovieReviews)
            });
}
