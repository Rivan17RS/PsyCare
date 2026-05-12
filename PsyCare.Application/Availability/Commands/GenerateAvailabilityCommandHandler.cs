namespace PsyCare.Application.Availability.Commands;

using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;

public class GenerateAvailabilityCommandHandler
    : IRequestHandler<GenerateAvailabilityCommand, GenerateAvailabilityResult>
{
    private readonly IAvailabilityRepository _repository;

    public GenerateAvailabilityCommandHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<GenerateAvailabilityResult> Handle(
        GenerateAvailabilityCommand request,
        CancellationToken cancellationToken)
    {
        var createdSlots = new List<AvailabilitySlot>();

        var startUtc = request.Date.Date.Add(request.StartHour);
        var endUtc = request.Date.Date.Add(request.EndHour);

        var existingSlots = await _repository.GetPsychologistSlotsAsync(
            request.TenantId,
            request.PsychologistId,
            request.Date,
            cancellationToken);

        var existingStartTimes = existingSlots
            .Select(x => x.StartTime)
            .ToHashSet();

        var current = startUtc;

        int skipped = 0;

        while (current < endUtc)
        {
            var slotEnd = current.AddMinutes(request.DurationMinutes);

            if (existingStartTimes.Contains(current))
            {
                skipped++;
            }
            else
            {
                createdSlots.Add(new AvailabilitySlot(
                    request.TenantId,
                    request.PsychologistId,
                    current,
                    slotEnd));
            }

            current = slotEnd;
        }

        if (createdSlots.Count > 0)
        {
            await _repository.AddSlotsAsync(
                createdSlots,
                cancellationToken);
        }

        return new GenerateAvailabilityResult
        {
            Created = createdSlots.Count,
            Skipped = skipped
        };
    }
}