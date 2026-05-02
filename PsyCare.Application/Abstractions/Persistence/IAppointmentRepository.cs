using PsyCare.Domain.Entities;

namespace PsyCare.Application.Abstractions.Persistence;

public interface IAppointmentRepository
{
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);

    Task<bool> IsSlotBookedAsync(
        Guid tenantId,
        Guid psychologistId,
        DateTime start,
        DateTime end,
        CancellationToken cancellationToken);

    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task UpdateAsync(Appointment appointment, CancellationToken cancellationToken);
}