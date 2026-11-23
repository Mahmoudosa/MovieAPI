
namespace MyMovieApp.DTOs;

public class MovieDto
{
    public string Title { get; set; } = string.Empty;
    public string Director { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public int CategoryId { get; set; }
    public string? Description { get; set; }
}
