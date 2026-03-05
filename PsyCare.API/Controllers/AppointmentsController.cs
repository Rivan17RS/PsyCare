using MediatR;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Application.Appointments.Commands;
using PsyCare.Application.Appointments.Queries;

namespace PsyCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

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
    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability(
        Guid tenantId,
        Guid psychologistId,
        DateTime date)
    {
        var result = await _mediator.Send(
            new GetAvailableSlotsQuery(tenantId, psychologistId, date));

        return Ok(result);
    }

    // Add slot generation endpoint for psychologists to create availability
    [HttpPost("generate-slots")]
    public async Task<IActionResult> GenerateSlots(
        GenerateAvailabilitySlotsCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

}