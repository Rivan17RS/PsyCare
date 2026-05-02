using MediatR;
using PsyCare.Application.Appointments.Queries;

public record GetAppointmentHistoryQuery(string UserId)
    : IRequest<List<MyAppointmentDto>>;