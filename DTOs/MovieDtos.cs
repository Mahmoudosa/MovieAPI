using System.ComponentModel.DataAnnotations;

namespace MovieApi.DTOs;

// Returned in the LIST: light, no description
public record MovieListItemDto(int Id, string Title, int ReleaseYear, string Genre, string? PosterUrl);

// Returned when you CLICK a movie: full details
public record MovieDetailsDto(int Id, string Title, string Description, string Genre,
                              int ReleaseYear, string Director, string? PosterUrl);

// Accepted for CREATE and UPDATE (with validation rules)
public class SaveMovieDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Genre { get; set; } = string.Empty;

    [Range(1888, 2100)]                       // first films were made around 1888
    public int ReleaseYear { get; set; }

    [Required, StringLength(100)]
    public string Director { get; set; } = string.Empty;

    [Url]
    public string? PosterUrl { get; set; }
}