namespace PsyCare.Application.Availability.Queries;

using MediatR;
using PsyCare.Domain.Entities;

public class GetPsychologistAvailabilityQuery
    : IRequest<List<AvailabilitySlot>>
{
    public Guid TenantId { get; set; }

    public Guid PsychologistId { get; set; }

    public DateTime Date { get; set; }
}