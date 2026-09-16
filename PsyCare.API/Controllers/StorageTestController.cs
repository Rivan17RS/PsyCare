using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/dev/storage")]
[AllowAnonymous]
public class StorageTestController : ControllerBase
{
    private readonly IFileStorage _fileStorage;
    private readonly IWebHostEnvironment _environment;

    public StorageTestController(
        IFileStorage fileStorage,
        IWebHostEnvironment environment)
    {
        _fileStorage = fileStorage;
        _environment = environment;
    }

    [HttpPost("profile-image")]
    public async Task<IActionResult> UploadProfileImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("A file is required.");
        }

        await using var stream = file.OpenReadStream();

        var path = await _fileStorage.SaveAsync(
            stream,
            file.FileName,
            file.ContentType,
            cancellationToken);

        return Ok(new
        {
            path,
            url = $"{Request.Scheme}://{Request.Host}/{path}"
        });
    }
}