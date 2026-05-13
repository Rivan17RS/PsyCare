using MediatR;

using PsyCare.Application.Abstractions.Persistence;

namespace PsyCare.Application.Availability.Queries;

public class GetAvailabilityRangeQueryHandler
    : IRequestHandler<
        GetAvailabilityRangeQuery,
        List<AvailabilityDayDto>>
{
    private readonly IAvailabilityRepository _repository;

    public GetAvailabilityRangeQueryHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AvailabilityDayDto>> Handle(
        GetAvailabilityRangeQuery request,
        CancellationToken cancellationToken)
    {
        var slots =
            await _repository.GetAvailabilityRangeAsync(
                request.TenantId,
                request.PsychologistId,
                request.StartDate,
                request.EndDate,
                cancellationToken);

        var grouped =
            slots.GroupBy(x => x.StartTime.Date)
                 .OrderBy(x => x.Key)
                 .Select(group => new AvailabilityDayDto
                 {
                     Date = group.Key,

                     Slots = group.Select(slot =>
                        new AvailabilitySlotDto
                        {
                            Id = slot.Id,
                            StartTime = slot.StartTime,
                            EndTime = slot.EndTime,
                            IsBooked = slot.IsBooked
                        })
                        .ToList()
                 })
                 .ToList();

        return grouped;
    }
}