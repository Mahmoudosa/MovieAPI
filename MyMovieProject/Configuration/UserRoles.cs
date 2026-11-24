namespace MyMovieApp.Configuration;

public static class UserRoles
{
    public const string User = "User";
    public const string Author = "Author";
    public const string Admin = "Admin";
    public const string MovieManagers = Admin + "," + Author;

    public static string Normalize(string? role) =>
        role?.Trim().ToUpperInvariant() switch
        {
            "ADMIN" => Admin,
            "AUTHOR" => Author,
            _ => User
        };
}
