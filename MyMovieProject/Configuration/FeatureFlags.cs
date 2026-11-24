namespace MyMovieApp.Configuration;

public sealed class FeatureFlags
{
    public bool EnableMovieSearch { get; set; } = true;
    public bool EnableMovieCreation { get; set; } = true;
    public bool EnableMovieUpdates { get; set; } = true;
    public bool EnableMovieDeletion { get; set; } = true;
    public bool EnableMovieReviews { get; set; } = true;
}
