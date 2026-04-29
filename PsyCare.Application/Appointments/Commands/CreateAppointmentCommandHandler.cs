using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;
using PsyCare.Domain.Enums;

namespace PsyCare.Application.Appointments.Commands;

public class CreateAppointmentCommandHandler 
    : IRequestHandler<CreateAppointmentInternalCommand, Guid>
{
    private readonly IAppointmentRepository _repository;

    public CreateAppointmentCommandHandler(IAppointmentRepository repository)
    {
        _repository = repository;
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