using MediatR;

using PsyCare.Application.Abstractions.Persistence;

using PsyCare.Domain.Entities;

namespace PsyCare.Application.Availability.Commands;

public class GenerateAvailabilityRangeCommandHandler
    : IRequestHandler<
        GenerateAvailabilityRangeCommand,
        GenerateAvailabilityRangeResult>
{
    private readonly IAvailabilityRepository _repository;

    public GenerateAvailabilityRangeCommandHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<GenerateAvailabilityRangeResult> Handle(
        GenerateAvailabilityRangeCommand request,
        CancellationToken cancellationToken)
    {
        var created = 0;

        var skipped = 0;

        var currentDate = request.StartDate.Date;

        while (currentDate <= request.EndDate.Date)
        {
            var start =
                currentDate.AddHours(request.StartHour);

            var end =
                currentDate.AddHours(request.EndHour);

            var current = start;

            while (current < end)
            {
                var slotEnd =
                    current.AddMinutes(
                        request.SlotMinutes);

                // Check duplicate
                var exists =
                    await _repository.ExistsAsync(
                        request.TenantId,
                        request.PsychologistId,
                        current,
                        slotEnd,
                        cancellationToken);

                if (exists)
                {
                    skipped++;
                }
                else
                {
                    var slot = new AvailabilitySlot(
                        request.TenantId,
                        request.PsychologistId,
                        current,
                        slotEnd
                    );

                    await _repository.AddSlotsAsync(
                        new List<AvailabilitySlot> { slot },
                        cancellationToken);

                    created++;
                }

                current = slotEnd;
            }

            currentDate =
                currentDate.AddDays(1);
        }

        return new GenerateAvailabilityRangeResult
        {
            Created = created,
            Skipped = skipped
        };
    }
}