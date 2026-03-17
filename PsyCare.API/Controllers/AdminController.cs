using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.Infrastructure.Identity;
using PsyCare.Infrastructure.Persistence;
using PsyCare.API.Security;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/admin")]
[AuthorizePlatformAdmin]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;

    public AdminController(
        UserManager<ApplicationUser> userManager,
        AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    // Admin endpoints to list all users, clinics and psychologists for management purposes
    [HttpGet("users")]
    public IActionResult GetAllUsers()
    {
        var users = _userManager.Users.ToList();

        return Ok(users);
    }

    [HttpGet("clinics")]
    public async Task<IActionResult> GetAllClinics()
    {
        var clinics = await _context.Tenants
            .IgnoreQueryFilters()
            .ToListAsync();

        return Ok(clinics);
    }

    [HttpGet("psychologists")]
    public async Task<IActionResult> GetPsychologists()
    {
        var users = await _userManager.Users.ToListAsync();

        var psychologists = new List<ApplicationUser>();

        foreach (var user in users)
        {
            if (await _userManager.IsInRoleAsync(user, "Psychologist"))
                psychologists.Add(user);
        }

        return Ok(psychologists);
    }

    [HttpGet("patients")]
    public async Task<IActionResult> GetPatients()
    {
        var users = await _userManager.Users.ToListAsync();

        var patients = new List<ApplicationUser>();

        foreach (var user in users)
        {
            if (await _userManager.IsInRoleAsync(user, "Patient"))
                patients.Add(user);
        }

        return Ok(patients);
    }

    [HttpGet("invitations")]
    public async Task<IActionResult> GetInvitations()
    {
        var invitations = await _context.Invitations
            .IgnoreQueryFilters()
            .ToListAsync();

        return Ok(invitations);
    }
}