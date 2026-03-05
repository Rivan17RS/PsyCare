using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Infrastructure.Services;
using PsyCare.Infrastructure.Identity;
using PsyCare.Domain.Entities;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, JwtTokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            return Unauthorized();

        var tenantId = Guid.NewGuid(); // temporary until we link user → tenant

        var roles = await _userManager.GetRolesAsync(user);

        var token = _tokenService.GenerateToken(
            user.Id,
            user.Email!,
            tenantId,
            roles);

        return Ok(new { token });
    }
}