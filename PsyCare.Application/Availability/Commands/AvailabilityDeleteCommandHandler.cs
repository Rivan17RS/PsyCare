namespace PsyCare.Application.Availability.Commands;

using MediatR;
using PsyCare.Application.Abstractions.Persistence;

public class DeleteAvailabilitySlotCommandHandler
    : IRequestHandler<DeleteAvailabilitySlotCommand>
{
    private readonly IAvailabilityRepository _repository;

    public DeleteAvailabilitySlotCommandHandler(
        IAvailabilityRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        DeleteAvailabilitySlotCommand request,
        CancellationToken cancellationToken)
    {
        var slot = await _repository.GetSlotAsync(
            request.SlotId,
            cancellationToken);

        if (slot == null)
            throw new Exception("Slot not found");

        if (slot.IsBooked)
            throw new Exception("Booked slots cannot be deleted");

        if (slot.StartTime <= DateTime.UtcNow)
            throw new Exception("Past slots cannot be deleted");

        await _repository.DeleteAsync(slot, cancellationToken);
    }
}