namespace MyMovieApp.DTOs
{
    public class MovieDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }=string.Empty;
        public string Director { get; set; }=string.Empty;
        public int ReleaseYear { get; set; }
        public string Genre { get; set; }=string.Empty;
    }
}