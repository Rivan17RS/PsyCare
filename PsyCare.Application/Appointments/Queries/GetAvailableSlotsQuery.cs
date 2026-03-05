using MediatR;
using PsyCare.Domain.Entities;

namespace PsyCare.Application.Appointments.Queries;

public record GetAvailableSlotsQuery(
    Guid TenantId,
    Guid PsychologistId,
    DateTime Date
) : IRequest<List<AvailabilitySlot>>;