using MediatR;
using PsyCare.Domain.Enums;

namespace PsyCare.Application.Appointments.Commands;

public record CreateAppointmentInternalCommand(
    Guid TenantId,
    Guid PsychologistId,
    Guid PatientId,
    DateTime StartTime,
    DateTime EndTime,
    AppointmentMode Mode
) : IRequest<Guid>;