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
    
    Task<List<AvailabilitySlot>> GetPsychologistSlotsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime date,
        CancellationToken cancellationToken);
    
    Task DeleteAsync(
        AvailabilitySlot slot,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startTime,
        DateTime endTime,
        CancellationToken cancellationToken);

    Task<List<AvailabilitySlot>> GetRangeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken);

    Task DeleteRangeAsync(
        List<AvailabilitySlot> slots,
        CancellationToken cancellationToken);

    Task<AvailabilitySlot?> FindByTimeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startTime,
        DateTime endTime,
        CancellationToken cancellationToken);

    Task<List<AvailabilitySlot>> GetAvailabilityRangeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken);
    
    
}