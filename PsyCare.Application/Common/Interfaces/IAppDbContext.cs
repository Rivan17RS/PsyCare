using Microsoft.EntityFrameworkCore;
using PsyCare.Domain.Entities;

namespace PsyCare.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Appointment> Appointments { get; }
    DbSet<AvailabilitySlot> AvailabilitySlots { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Invitation> Invitations { get; }

    IQueryable<IUser> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}