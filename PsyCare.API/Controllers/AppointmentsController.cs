using MediatR;
using Microsoft.AspNetCore.Mvc;
using PsyCare.Application.Appointments.Commands;

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
}