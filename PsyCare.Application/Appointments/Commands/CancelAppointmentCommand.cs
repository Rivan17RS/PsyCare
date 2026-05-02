using MediatR;

public record CancelAppointmentCommand(Guid AppointmentId)
    : IRequest;