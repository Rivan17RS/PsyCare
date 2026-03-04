using MediatR;
using PsyCare.Domain.Enums;

namespace PsyCare.Application.Appointments.Commands;

public record CreateAppointmentCommand(
    Guid PsychologistId,
    Guid PatientId,
    DateTime StartTime,
    DateTime EndTime,
    AppointmentMode Mode
) : IRequest<Guid>;