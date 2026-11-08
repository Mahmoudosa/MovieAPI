using Microsoft.EntityFrameworkCore;
using MyMovieApp.Models;

namespace MyMovieApp.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {
            
        }
        public DbSet<Movie> Movies { get; set; }   
    }
}
