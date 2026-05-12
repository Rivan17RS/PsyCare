using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Application.Availability.Commands;
using PsyCare.Application.Availability.Queries;
using PsyCare.Application.Common.Interfaces;
using System.Security.Claims;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/psychologist/availability")]
[Authorize(Roles = "Psychologist")]
public class PsychologistAvailabilityController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ITenantProvider _tenantProvider;

    public PsychologistAvailabilityController(
        IMediator mediator,
        ITenantProvider tenantProvider)
    {
        _mediator = mediator;
        _tenantProvider = tenantProvider;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAvailability(
        [FromQuery] DateTime date)
    {
        var tenantId = _tenantProvider.GetTenantId();

        var psychologistId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _mediator.Send(
            new GetPsychologistAvailabilityQuery
            {
                TenantId = tenantId,
                PsychologistId = psychologistId,
                Date = date
            });

        return Ok(result);
    }

    [HttpPost("generate")]
    public async Task<IActionResult> GenerateAvailability(
        GenerateAvailabilitySlotsRequest request)
    {
        var psychologistId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var tenantId = _tenantProvider.GetTenantId();

        var command = new GenerateAvailabilitySlotsCommand(
            tenantId,
            psychologistId,
            request.Date,
            request.StartHour,
            request.EndHour,
            request.SlotMinutes
        );

        await _mediator.Send(command);

        return Ok();
    }

    [HttpPost("generate-range")]
    public async Task<IActionResult> GenerateRange(
        [FromBody] GenerateAvailabilityRangeRequest request)
    {
        var psychologistId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var tenantId =
            _tenantProvider.GetTenantId();

        var command =
            new GenerateAvailabilityRangeCommand(
                tenantId,
                psychologistId,
                request.StartDate,
                request.EndDate,
                request.StartHour,
                request.EndHour,
                request.SlotMinutes
            );

        var result =
            await _mediator.Send(command);

        return Ok(result);
    }

    [HttpDelete("range")]
    public async Task<IActionResult> DeleteRange(
        [FromBody] DeleteAvailabilityRangeRequest request)
    {
        var psychologistId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var tenantId =
            _tenantProvider.GetTenantId();

        var command =
            new DeleteAvailabilityRangeCommand(
                tenantId,
                psychologistId,
                request.StartDate,
                request.EndDate
            );

        var result =
            await _mediator.Send(command);

        return Ok(result);
    }

    [HttpDelete("{slotId}")]
    public async Task<IActionResult> DeleteSlot(Guid slotId)
    {
        await _mediator.Send(
            new DeleteAvailabilitySlotCommand
            {
                SlotId = slotId
            });

        return NoContent();
    }
}