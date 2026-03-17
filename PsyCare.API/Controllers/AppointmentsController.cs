using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PsyCare.Application.Appointments.Commands;
using PsyCare.Application.Appointments.Queries;
using PsyCare.Application.Common.Interfaces;
using PsyCare.API.Security;
using System.Security.Claims;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    private readonly ITenantProvider _tenantProvider;

    public AppointmentsController(
        IMediator mediator,
        ITenantProvider tenantProvider)
    {
        _mediator = mediator;
        _tenantProvider = tenantProvider;
    }

    [AuthorizePatient]
    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentCommand command)
    {
        var appointmentId = await _mediator.Send(command);

        return Ok(new
        {
            AppointmentId = appointmentId
        });
    }

    // API appointment availability endpoint
    [AuthorizePatientOrPsychologist]
    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability(
        Guid psychologistId,
        DateTime date)
    {
        var tenantId = _tenantProvider.GetTenantId();

        var result = await _mediator.Send(
            new GetAvailableSlotsQuery(tenantId, psychologistId, date));

        return Ok(result);
    }

    // Endpoint to get appointments
    [AuthorizePatientOrPsychologist]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var tenantId = _tenantProvider.GetTenantId();

        var result = await _mediator.Send(
            new GetMyAppointmentsQuery(userId!));

        return Ok(result);
    }

    // Add slot generation endpoint for psychologists to create availability
    [AuthorizePsychologist]
    [HttpPost("generate-slots")]
    public async Task<IActionResult> GenerateSlots(
        GenerateAvailabilitySlotsCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

}