namespace PsyCare.Application.Availability.Commands;

using MediatR;

public class DeleteAvailabilitySlotCommand : IRequest
{
    public Guid SlotId { get; set; }
}