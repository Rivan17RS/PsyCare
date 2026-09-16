using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.API.DTOs;
using PsyCare.Infrastructure.Persistence;
using System.Security.Claims;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/psychologist/profile")]
[Authorize(Roles = "Psychologist")]
public class PsychologistProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public PsychologistProfileController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var profile = await _context.PsychologistProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return NotFound("Psychologist profile not found.");

        return Ok(new
        {
            id = profile.Id,
            userId = profile.UserId,
            legalIdentityNumber = profile.LegalIdentityNumber,
            professionalLicense = profile.ProfessionalLicense,
            specialty = profile.Specialty,
            biography = profile.Biography,
            sex = profile.Sex,
            profileImageUrl = profile.ProfileImageUrl
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        UpdatePsychologistPersonalProfileRequest request)
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var profile = await _context.PsychologistProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return NotFound("Psychologist profile not found.");

        profile.UpdatePersonalInformation(
            request.Biography,
            request.Sex,
            request.ProfileImageUrl);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Psychologist profile updated successfully."
        });
    }


}