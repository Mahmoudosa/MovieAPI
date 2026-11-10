
namespace MyMovieApp.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        // Foreign Key to Movie
        public int MovieId { get; set; }

        // Navigation Property to Movie
        public Movie Movie { get; set; } = null!;

        // Foreign Key to User
        public int UserId { get; set; }

        // Navigation Property to User
        public User User { get; set; } = null!;
    }
}
