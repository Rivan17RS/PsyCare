using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;

namespace PsyCare.Application.Appointments.Queries;

public class GetAvailableSlotsQueryHandler 
    : IRequestHandler<GetAvailableSlotsQuery, List<AvailabilitySlot>>
{
    private readonly IAvailabilityRepository _repository;

    public GetAvailableSlotsQueryHandler(IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AvailabilitySlot>> Handle(
        GetAvailableSlotsQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.GetAvailableSlotsAsync(
            request.TenantId,
            request.PsychologistId,
            request.Date,
            cancellationToken);
    }
}