
namespace MyMovieApp.Models
{
    public class Movie
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Director { get; set; } = string.Empty;

        public int ReleaseYear { get; set; }

        // Foreign Key to Category
        public int CategoryId { get; set; }

        // Navigation Property
        public Category Category { get; set; } = null!;

        // One Movie -> Many Reviews
        public ICollection<Review> Reviews { get; set; }
            = new List<Review>();

        // One Movie -> Many Watchlist entries
        public ICollection<Watchlist> Watchlists { get; set; }
            = new List<Watchlist>();
    }
}
