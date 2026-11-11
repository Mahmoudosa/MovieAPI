namespace MyMovieApp.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Watchlist> Watchlists { get; set; } = new List<Watchlist>();
    }
}