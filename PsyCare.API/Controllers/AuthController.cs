using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.API.DTOs;
using PsyCare.Infrastructure.Services;
using PsyCare.Infrastructure.Identity;
using PsyCare.Infrastructure.Persistence;
using System.Security.Claims;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _tokenService;
    private readonly AppDbContext _context;

    public AuthController(
        UserManager<ApplicationUser> userManager, 
        JwtTokenService tokenService,
        AppDbContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
    }

    // Login endpoint for authenticating users and generating JWT tokens
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        var token = _tokenService.GenerateToken(
            user.Id.ToString(),
            user.Email!,
            user.TenantId,
            roles);

        return Ok(new { token });
    }

    // Register endpoint for crating new users - patient as default role
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            TenantId = request.TenantId
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Default role
        await _userManager.AddToRoleAsync(user, "Patient");

        var roles = await _userManager.GetRolesAsync(user);

        var token = _tokenService.GenerateToken(
            user.Id.ToString(),
            user.Email!,
            user.TenantId,
            roles);

        return Ok(new { token });
    }
    // Me section to get current user info based on JWT token
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            fullName = user.FullName,
            tenantId = user.TenantId,
            roles
        });
    }

    // Endpoint for registering psychologists using an invitation token
    [HttpPost("register-psychologist")]
    public async Task<IActionResult> RegisterPsychologist(RegisterPsychologistRequest request)
    {
        var invitation = await _context.Invitations
            .FirstOrDefaultAsync(i => i.Token == request.Token);

        if (invitation == null)
            return BadRequest("Invalid invitation.");

        if (invitation.IsUsed)
            return BadRequest("Invitation already used.");

        if (invitation.ExpiresAt < DateTime.UtcNow)
            return BadRequest("Invitation expired.");

        var user = new ApplicationUser
        {
            UserName = invitation.Email,
            Email = invitation.Email,
            FullName = request.FullName,
            TenantId = invitation.TenantId
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, invitation.Role);

        invitation.MarkAsUsed();

        await _context.SaveChangesAsync();

        return Ok("Psychologist registered successfully.");
    }
}