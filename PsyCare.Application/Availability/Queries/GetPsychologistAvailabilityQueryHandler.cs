namespace PsyCare.Application.Availability.Queries;

using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;

public class GetPsychologistAvailabilityQueryHandler
    : IRequestHandler<GetPsychologistAvailabilityQuery, List<AvailabilitySlot>>
{
    private readonly IAvailabilityRepository _repository;

    public GetPsychologistAvailabilityQueryHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AvailabilitySlot>> Handle(
        GetPsychologistAvailabilityQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.GetPsychologistSlotsAsync(
            request.TenantId,
            request.PsychologistId,
            request.Date,
            cancellationToken);
    }
}