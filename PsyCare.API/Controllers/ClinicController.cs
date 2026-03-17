using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Common.Interfaces;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Identity;
using PsyCare.Infrastructure.Persistence;
using PsyCare.API.Security;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/clinics")]
[Authorize]
public class ClinicController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITenantProvider _tenantProvider;

    public ClinicController(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        ITenantProvider tenantProvider)
    {
        _context = context;
        _userManager = userManager;
        _tenantProvider = tenantProvider;
    }

    [AllowAnonymous]
    [HttpPost("create")]
    public async Task<IActionResult> CreateClinic(RegisterClinicRequest request)
    {
        // Check if subdomain is already taken
        var normalizedSubdomain = request.Subdomain.ToLower();

        var exists = await _context.Tenants
            .IgnoreQueryFilters()
            .AnyAsync(t => t.Subdomain.ToLower() == normalizedSubdomain);

        if (exists)
            return BadRequest("Subdomain already taken.");
            
        var tenant = new Tenant(request.ClinicName, normalizedSubdomain);

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            TenantId = tenant.Id
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "ClinicAdmin");

        return Ok(new
        {
            message = "Clinic created successfully",
            tenantId = tenant.Id
        });
    }

    [AuthorizeClinicAdmin]
    [HttpGet("me")]
    public async Task<IActionResult> GetClinic()
    {
        var tenantId = _tenantProvider.GetTenantId();

        var clinic = await _context.Tenants
            .FirstOrDefaultAsync(t => t.Id == tenantId);

        if (clinic == null)
            return NotFound();

        return Ok(clinic);
    }

    [AuthorizeClinicAdmin]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var tenantId = _tenantProvider.GetTenantId();

        var users = await _userManager.Users
            .Where(u => u.TenantId == tenantId)
            .ToListAsync();

        return Ok(users);
    }

    [AuthorizeClinicAdmin]
    [HttpGet("psychologists")]
    public async Task<IActionResult> GetPsychologists()
    {
        var tenantId = _tenantProvider.GetTenantId();

        var users = await _userManager.Users
            .Where(u => u.TenantId == tenantId)
            .ToListAsync();

        var psychologists = new List<ApplicationUser>();

        foreach (var user in users)
        {
            if (await _userManager.IsInRoleAsync(user, "Psychologist"))
                psychologists.Add(user);
        }

        return Ok(psychologists);
    }

    [AuthorizeClinicAdmin]
    [HttpGet("patients")]
    public async Task<IActionResult> GetPatients()
    {
        var tenantId = _tenantProvider.GetTenantId();

        var users = await _userManager.Users
            .Where(u => u.TenantId == tenantId)
            .ToListAsync();

        var patients = new List<ApplicationUser>();

        foreach (var user in users)
        {
            if (await _userManager.IsInRoleAsync(user, "Patient"))
                patients.Add(user);
        }

        return Ok(patients);
    }

}