using MediatR;

namespace PsyCare.Application.Appointments.Queries;

public class GetMyAppointmentsQuery : IRequest<List<MyAppointmentDto>>
{
    public string UserId { get; }

    public GetMyAppointmentsQuery(string userId)
    {
        UserId = userId;
    }
}