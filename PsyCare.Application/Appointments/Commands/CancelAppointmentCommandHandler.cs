using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Enums;

public class CancelAppointmentCommandHandler
    : IRequestHandler<CancelAppointmentCommand>
{
    private readonly IAppointmentRepository _repository;

    public CancelAppointmentCommandHandler(IAppointmentRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        CancelAppointmentCommand request,
        CancellationToken cancellationToken)
    {
        var appointment = await _repository.GetByIdAsync(
            request.AppointmentId,
            cancellationToken);

        if (appointment == null)
            throw new Exception("Appointment not found");

        //Cancel will be available only 24h before appointment date
        if (appointment.StartTime <= DateTime.UtcNow.AddHours(24))
        {
            throw new InvalidOperationException(
                "No puedes cancelar con menos de 24 horas de anticipación.");
        }

        // Optional safety
        if (appointment.Status == AppointmentStatus.Cancelled)
            throw new InvalidOperationException("La cita ya está cancelada.");

        appointment.Cancel();

        await _repository.UpdateAsync(appointment, cancellationToken);
    }
}