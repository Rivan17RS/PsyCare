using MediatR;

namespace PsyCare.Application.Appointments.Commands;

public record GenerateAvailabilitySlotsCommand(
    Guid TenantId,
    Guid PsychologistId,
    DateTime Date,
    int StartHour,
    int EndHour,
    int SlotMinutes
) : IRequest;
