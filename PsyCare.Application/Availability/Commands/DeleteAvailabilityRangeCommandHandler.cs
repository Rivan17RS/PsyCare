using MediatR;

using PsyCare.Application.Abstractions.Persistence;

namespace PsyCare.Application.Availability.Commands;

public class DeleteAvailabilityRangeCommandHandler
    : IRequestHandler<
        DeleteAvailabilityRangeCommand,
        DeleteAvailabilityRangeResult>
{
    private readonly IAvailabilityRepository _repository;

    public DeleteAvailabilityRangeCommandHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<DeleteAvailabilityRangeResult> Handle(
        DeleteAvailabilityRangeCommand request,
        CancellationToken cancellationToken)
    {
        var slots = await _repository.GetRangeAsync(
            request.TenantId,
            request.PsychologistId,
            request.StartDate,
            request.EndDate,
            cancellationToken);

        var deletable =
            slots.Where(x => !x.IsBooked)
                 .ToList();

        var preservedBooked =
            slots.Count(x => x.IsBooked);

        if (deletable.Any())
        {
            await _repository.DeleteRangeAsync(
                deletable,
                cancellationToken);
        }

        return new DeleteAvailabilityRangeResult
        {
            Deleted = deletable.Count,
            PreservedBooked = preservedBooked
        };
    }
}