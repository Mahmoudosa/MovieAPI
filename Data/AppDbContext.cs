using Microsoft.EntityFrameworkCore;
using MovieApi.Models;

namespace MovieApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Movie> Movies => Set<Movie>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Movie>(e =>
        {
            e.Property(m => m.Title).IsRequired().HasMaxLength(200);
            e.Property(m => m.Description).HasMaxLength(2000);

            // Seed data: inserted when the database is created
            e.HasData(
                new Movie { Id = 1, Title = "Inception", Genre = "Sci-Fi", ReleaseYear = 2010,
                    Director = "Christopher Nolan",
                    Description = "A thief who steals secrets through dreams is given a chance to plant an idea instead." },
                new Movie { Id = 2, Title = "The Shawshank Redemption", Genre = "Drama", ReleaseYear = 1994,
                    Director = "Frank Darabont",
                    Description = "Two imprisoned men bond over years, finding hope and redemption through acts of decency." },
                new Movie { Id = 3, Title = "Spirited Away", Genre = "Animation", ReleaseYear = 2001,
                    Director = "Hayao Miyazaki",
                    Description = "A young girl wanders into a world of spirits and must work to free her parents." }
            );
        });
    }
}