using Microsoft.EntityFrameworkCore;
using MovieApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();                       // API controllers only, no views
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));  // or UseSqlServer
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
    options.AddPolicy("Html", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "Movie API v1"));
}

app.UseHttpsRedirection();
app.UseDefaultFiles();     // "/" becomes "/index.html"  (must come BEFORE UseStaticFiles)
app.UseStaticFiles(); 
app.UseCors("Html");      // serves files from wwwroot
app.MapControllers();

app.Run();