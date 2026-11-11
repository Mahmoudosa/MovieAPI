
using Microsoft.AspNetCore.Mvc;
using MyMovieApp.DTOs;
using MyMovieApp.Models;
using MyMovieApp.Repositories.Interfaces;

namespace MyMovieApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(
        ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult> GetCategories()
    {
        var categories = await _categoryRepository.GetAllAsync();

        var result = categories.Select(c => new
        {
            c.Id,
            c.Name,
            c.Description
        });

        return Ok(result);
    }

    // GET: api/categories/1
    [HttpGet("{id}")]
    public async Task<ActionResult> GetCategoryById(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(new
        {
            category.Id,
            category.Name,
            category.Description
        });
    }

    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult> AddCategory(CategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description
        };

        await _categoryRepository.AddAsync(category);

        return CreatedAtAction(
            nameof(GetCategoryById),
            new { id = category.Id },
            new
            {
                category.Id,
                category.Name,
                category.Description
            });
    }

    // PUT: api/categories/1
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCategory(
        int id, CategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        category.Name = dto.Name;
        category.Description = dto.Description;

        await _categoryRepository.SaveChangesAsync();

        return Ok(new
        {
            category.Id,
            category.Name,
            category.Description
        });
    }

    // DELETE: api/categories/1
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        bool hasMovies = await _categoryRepository.HasMoviesAsync(id);

        if (hasMovies)
            return Conflict(
                "Cannot delete category because it has movies.");

        await _categoryRepository.DeleteAsync(category);

        return NoContent();
    }
}
