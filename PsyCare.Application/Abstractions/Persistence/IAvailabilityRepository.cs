using PsyCare.Domain.Entities;

namespace PsyCare.Application.Abstractions.Persistence;

public interface IAvailabilityRepository
{
    Task<AvailabilitySlot?> GetSlotAsync(Guid slotId, CancellationToken cancellationToken);

    Task<List<AvailabilitySlot>> GetAvailableSlotsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime date,
        CancellationToken cancellationToken);

    Task UpdateAsync(AvailabilitySlot slot, CancellationToken cancellationToken);

    Task AddSlotsAsync(
        List<AvailabilitySlot> slots,
        CancellationToken cancellationToken);
}