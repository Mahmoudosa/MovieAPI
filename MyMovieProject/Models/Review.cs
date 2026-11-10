
using System.ComponentModel.DataAnnotations;

namespace MyMovieApp.Models
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ReviewerName { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Comment { get; set; } = string.Empty;

        // Foreign Key
        [Range(1, int.MaxValue)]
        public int MovieId { get; set; }

        // Navigation Property
        public Movie Movie { get; set; } = null!;
    }
}
