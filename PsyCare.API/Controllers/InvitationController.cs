using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Common.Interfaces;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Persistence;
using PsyCare.API.Security;

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
}