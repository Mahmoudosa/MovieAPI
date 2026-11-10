
namespace MyMovieApp.DTOs;

public class ReviewDto
{
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int MovieId { get; set; }
    public int UserId { get; set; }
}
