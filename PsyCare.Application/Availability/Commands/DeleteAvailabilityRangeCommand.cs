using MediatR;

namespace PsyCare.Application.Availability.Commands;

public record DeleteAvailabilityRangeCommand(
    Guid TenantId,
    Guid PsychologistId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<DeleteAvailabilityRangeResult>;