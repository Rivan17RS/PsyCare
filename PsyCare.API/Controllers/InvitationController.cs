using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Common.Interfaces;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Persistence;
using PsyCare.API.Security;
using PsyCare.API.DTOs;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITenantProvider _tenantProvider;

    public InvitationController(AppDbContext context, ITenantProvider tenantProvider)
    {
        _context = context;
        _tenantProvider = tenantProvider;
    }

    [AuthorizeClinicAdmin]
    [HttpPost("psychologist")]
    public async Task<IActionResult> InvitePsychologist(InvitePsychologistRequest request)
    {
        var tenantId = _tenantProvider.GetTenantId();

        var invitation = new Invitation(
            request.Email,
            tenantId,
            "Psychologist"
        );

        _context.Invitations.Add(invitation);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Invitation created",
            token = invitation.Token
        });
    }

    // Dev endpoint to list all invitations - *** REMOVE IN PROD ***
    [HttpGet("dev")]
    public async Task<IActionResult> GetInvitations()
    {
        var invitations = await _context.Invitations
            .Select(i => new
            {
                i.Email,
                i.Token,
                link = $"https://localhost:5001/register?token={i.Token}",
                i.ExpiresAt,
                i.IsUsed
            })
            .ToListAsync();

        return Ok(invitations);
    }

    [AllowAnonymous]
    [HttpGet("{token}")]
    public async Task<IActionResult> GetInvitation(string token)
    {
        var invitation = await _context.Invitations
            .FirstOrDefaultAsync(i => i.Token == token);

        if (invitation == null)
            return NotFound("Invitation not found.");

        if (invitation.IsUsed)
            return BadRequest("Invitation already used.");

        if (invitation.ExpiresAt < DateTime.UtcNow)
            return BadRequest("Invitation expired.");

        return Ok(new InvitationDetailsResponse
        {
            Email = invitation.Email,
            Role = invitation.Role,
            ExpiresAt = invitation.ExpiresAt
        });
    }
}