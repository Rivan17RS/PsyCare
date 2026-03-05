using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Persistence;

namespace PsyCare.Infrastructure.Persistence.Repositories;

public class AvailabilityRepository : IAvailabilityRepository
{
    private readonly AppDbContext _context;

    public AvailabilityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AvailabilitySlot?> GetSlotAsync(Guid slotId, CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .FirstOrDefaultAsync(s => s.Id == slotId, cancellationToken);
    }

    public async Task<List<AvailabilitySlot>> GetAvailableSlotsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime date,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .Where(s =>
                s.TenantId == tenantId &&
                s.PsychologistId == psychologistId &&
                s.StartTime.Date == date.Date &&
                !s.IsBooked)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(AvailabilitySlot slot, CancellationToken cancellationToken)
    {
        _context.AvailabilitySlots.Update(slot);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task AddSlotsAsync(
        List<AvailabilitySlot> slots,
        CancellationToken cancellationToken)
    {
        await _context.AvailabilitySlots.AddRangeAsync(slots, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}