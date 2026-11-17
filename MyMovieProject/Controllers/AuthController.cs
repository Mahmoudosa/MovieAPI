using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyMovieApp.Repositories.Interfaces;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
// Add the namespaces for your User, RegisterDto, and LoginDto
// if they aren't already available.

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthController(
        IConfiguration configuration,
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher)
    {
        _configuration = configuration;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    // REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest("All fields are required.");
        }

        if (dto.Password.Length < 12)
        {
            return BadRequest(
                "Password must be at least 12 characters.");
        }

        // Check if email already exists
        var existingUser = await _userRepository
            .GetByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            return Conflict("Email already registered.");
        }

        // Create user
        var user = new User
        {
            UserName = dto.UserName,
            Email = dto.Email
        };

        // Hash password
        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password
        );

        // Save user
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return StatusCode(201, new
        {
            user.Id,
            user.UserName,
            user.Email
        });
    }

    // LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        // Find user by email
        var user = await _userRepository
            .GetByEmailAsync(dto.Email);

        if (user == null ||
            string.IsNullOrEmpty(user.PasswordHash))
        {
            return Unauthorized("Invalid credentials");
        }

        // Verify password
        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password
        );

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid credentials");
        }

        // Create claims
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

        // Get JWT key
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT key is missing");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        // Generate JWT
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