using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;
using PsyCare.Domain.Enums;

namespace PsyCare.Application.Appointments.Commands;

public class CreateAppointmentCommandHandler 
    : IRequestHandler<CreateAppointmentInternalCommand, Guid>
{
        private readonly IAppointmentRepository _repository;

        private readonly IAvailabilityRepository _availabilityRepository;

        public CreateAppointmentCommandHandler(
            IAppointmentRepository repository,
            IAvailabilityRepository availabilityRepository)
        {
            _repository = repository;

            _availabilityRepository =
                availabilityRepository;
        }

    public async Task<Guid> Handle(
        CreateAppointmentInternalCommand request,
        CancellationToken cancellationToken)
    {
        var isBooked = await _repository.IsSlotBookedAsync(
            request.TenantId,
            request.PsychologistId,
            request.StartTime,
            request.EndTime,
            cancellationToken);

        if (isBooked)
            throw new InvalidOperationException("This time slot is already booked.");

        var slot =
            await _availabilityRepository.FindByTimeAsync(
                request.TenantId,
                request.PsychologistId,
                request.StartTime,
                request.EndTime,
                cancellationToken);

        if (slot == null)
        {
            throw new InvalidOperationException(
                "Availability slot not found.");
        }

        slot.MarkAsBooked();

        await _availabilityRepository.UpdateAsync(
            slot,
            cancellationToken);

        var appointment = new Appointment(
            request.TenantId,
            request.PsychologistId,
            request.PatientId,
            request.StartTime,
            request.EndTime,
            request.Mode);

        await _repository.AddAsync(appointment, cancellationToken);

        return appointment.Id;
    }
}