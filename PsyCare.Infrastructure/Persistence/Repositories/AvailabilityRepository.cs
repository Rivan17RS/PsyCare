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
        var slots = await _context.AvailabilitySlots
            .Where(s =>
                s.TenantId == tenantId &&
                s.PsychologistId == psychologistId &&
                s.StartTime.Date == date.Date &&
                !s.IsBooked)
            .ToListAsync(cancellationToken);

        var now = DateTime.UtcNow;

        // Filter past hours if today
        if (date.Date == DateTime.UtcNow.Date)
        {
            slots = slots
                .Where(s => s.StartTime > now)
                .ToList();
        }

        return slots;
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

    public async Task<List<AvailabilitySlot>> GetPsychologistSlotsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime date,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .Where(s =>
                s.TenantId == tenantId &&
                s.PsychologistId == psychologistId &&
                s.StartTime.Date == date.Date)
            .OrderBy(s => s.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAsync(
        AvailabilitySlot slot,
        CancellationToken cancellationToken)
    {
        _context.AvailabilitySlots.Remove(slot);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startTime,
        DateTime endTime,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .AnyAsync(x =>
                x.TenantId == tenantId &&
                x.PsychologistId == psychologistId &&
                x.StartTime == startTime &&
                x.EndTime == endTime,
                cancellationToken);
    }

    public async Task<List<AvailabilitySlot>> GetRangeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .Where(x =>
                x.TenantId == tenantId &&
                x.PsychologistId == psychologistId &&
                x.StartTime >= startDate &&
                x.StartTime <= endDate)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteRangeAsync(
        List<AvailabilitySlot> slots,
        CancellationToken cancellationToken)
    {
        _context.AvailabilitySlots.RemoveRange(slots);

        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<AvailabilitySlot?> FindByTimeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startTime,
        DateTime endTime,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .FirstOrDefaultAsync(x =>
                x.TenantId == tenantId &&
                x.PsychologistId == psychologistId &&
                x.StartTime == startTime &&
                x.EndTime == endTime,
                cancellationToken);
    }

    public async Task<List<AvailabilitySlot>> GetAvailabilityRangeAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken)
    {
        return await _context.AvailabilitySlots
            .Where(x =>
                x.TenantId == tenantId &&
                x.PsychologistId == psychologistId &&
                x.StartTime >= startDate &&
                x.StartTime <= endDate)
            .OrderBy(x => x.StartTime)
            .ToListAsync(cancellationToken);
    }

}