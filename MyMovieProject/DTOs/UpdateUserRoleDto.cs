using System.ComponentModel.DataAnnotations;

namespace MyMovieApp.DTOs;

public sealed record UpdateUserRoleDto
{
    [Required]
    [RegularExpression("^(User|Author|Admin)$")]
    public required string Role { get; init; }
}
