namespace MyMovieApp.Models
{
    public class User
    {
        public int Id { get; set; }

        
        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
    
        public string? PasswordHash { get; set; }

        public string Role { get; set; } = "User";

        // Navigation Properties
        public ICollection<Review> Reviews { get; set; }
            = new List<Review>();

        public ICollection<Watchlist> Watchlists { get; set; }
            = new List<Watchlist>();

        public ICollection<Movie> AuthoredMovies { get; set; }
            = new List<Movie>();
    }
}
