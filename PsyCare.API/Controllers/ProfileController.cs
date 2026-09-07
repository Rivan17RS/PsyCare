using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Application.Account.Queries.GetMyProfile;
using PsyCare.Application.Account.Commands.UpdateMyProfile;
using PsyCare.API.DTOs;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        if (!Guid.TryParse(userId, out var userGuid))
            return Unauthorized();

        var profile = await _mediator.Send(
            new GetMyProfileQuery(userGuid));

        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateMyProfile(
        UpdateMyProfileRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        if (!Guid.TryParse(userId, out var userGuid))
            return Unauthorized();

        var command = new UpdateMyProfileCommand(
            userGuid,
            request.FullName,
            request.PhoneNumber);

        await _mediator.Send(command);

        return Ok();
    }
}