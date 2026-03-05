using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;

namespace PsyCare.Infrastructure.Persistence.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken)
    {
        await _context.Appointments.AddAsync(appointment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> IsSlotBookedAsync(Guid tenantId, Guid psychologistId, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        return await _context.Appointments
            .AnyAsync(a =>
                a.TenantId == tenantId &&
                a.PsychologistId == psychologistId &&
                a.StartTime == start &&
                a.EndTime == end,
                cancellationToken);
    }
}