using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyMovieProject.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieTimestamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Movies",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "Movies",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "Movies");
        }
    }
}
