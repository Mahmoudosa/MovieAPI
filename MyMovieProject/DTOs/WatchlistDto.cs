
namespace MyMovieApp.DTOs;

public class WatchlistDto
{
    public int MovieId { get; set; }
    public int UserId { get; set; }
    public bool IsWatched { get; set; }
}
