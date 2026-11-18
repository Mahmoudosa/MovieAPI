namespace MyMovieApp.DTOs;

public class MovieResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Director { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}