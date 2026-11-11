using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyMovieApp.Repositories.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{

    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;

    public AuthController(
        IConfiguration configuration,
        IUserRepository userRepository)
    {
        _configuration = configuration;
        _userRepository = userRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userRepository
            .GetByUserNameAndEmailAsync(
                dto.UserName,
                dto.Email);

        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        // DEMO ONLY: Name and email are not proof of identity.

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.UserName),

            new Claim(
                ClaimTypes.Email,
                user.Email)
        };

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT key is missing");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: credentials
        );

        return Ok(new
        {
            Token = new JwtSecurityTokenHandler()
                .WriteToken(token),

            ExpiresInMinutes = 30
        });
    }
}