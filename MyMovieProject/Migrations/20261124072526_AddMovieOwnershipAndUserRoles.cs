using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyMovieProject.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieOwnershipAndUserRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "User");

            migrationBuilder.AddColumn<int>(
                name: "OwnerUserId",
                table: "Movies",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movies_OwnerUserId",
                table: "Movies",
                column: "OwnerUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_Users_OwnerUserId",
                table: "Movies",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_Users_OwnerUserId",
                table: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Movies_OwnerUserId",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OwnerUserId",
                table: "Movies");
        }
    }
}
