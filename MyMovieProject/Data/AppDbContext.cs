using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyMovieApp.Models;

namespace MyMovieApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Watchlist> Watchlists { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateMovieTimestamps();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = default)
        {
            UpdateMovieTimestamps();

            return base.SaveChangesAsync(
                acceptAllChangesOnSuccess,
                cancellationToken);
        }

        private void UpdateMovieTimestamps()
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<Movie>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAtUtc = now;
                    entry.Entity.UpdatedAtUtc = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(movie => movie.CreatedAtUtc)
                        .IsModified = false;

                    var updatedAt = entry.Property(
                        movie => movie.UpdatedAtUtc);
                    updatedAt.CurrentValue = now;
                    updatedAt.IsModified = true;
                }
            }
        }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Movie>()
            .HasIndex(m => m.Title)
            .HasDatabaseName("IX_Movies_Title");
     
        }
    }
}
