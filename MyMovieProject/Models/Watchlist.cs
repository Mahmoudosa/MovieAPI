
namespace MyMovieApp.Models
{
    public class Watchlist
    {
        public int Id { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public bool IsWatched { get; set; } = false;

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
