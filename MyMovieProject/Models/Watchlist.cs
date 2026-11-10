
using System.ComponentModel.DataAnnotations;

namespace MyMovieApp.Models
{
    public class Watchlist
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public bool IsWatched { get; set; } = false;

        // Foreign Key
        [Range(1, int.MaxValue)]
        public int MovieId { get; set; }

        // Navigation Property
        public Movie Movie { get; set; } = null!;
    }
}
