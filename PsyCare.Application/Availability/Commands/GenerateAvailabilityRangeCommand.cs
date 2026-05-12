using MediatR;

namespace PsyCare.Application.Availability.Commands;

public record GenerateAvailabilityRangeCommand(
    Guid TenantId,
    Guid PsychologistId,
    DateTime StartDate,
    DateTime EndDate,
    int StartHour,
    int EndHour,
    int SlotMinutes
) : IRequest<GenerateAvailabilityRangeResult>;