using MediatR;

namespace PsyCare.Application.Availability.Queries;

public record GetAvailabilityRangeQuery(
    Guid TenantId,
    Guid PsychologistId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<List<AvailabilityDayDto>>;