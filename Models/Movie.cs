using System.ComponentModel.DataAnnotations;

namespace MovieApi.Models;

public class Movie
{
    public int Id { get; set; }

    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Genre { get; set; } = string.Empty;

    [Display(Name = "Release Year"), Range(1888, 2100)]
    public int ReleaseYear { get; set; }

    [Required, StringLength(100)]
    public string Director { get; set; } = string.Empty;

    [Display(Name = "Poster URL"), Url]
    public string? PosterUrl { get; set; }
}