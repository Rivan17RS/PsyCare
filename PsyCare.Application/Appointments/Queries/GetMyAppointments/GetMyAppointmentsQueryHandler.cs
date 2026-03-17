using MediatR;
using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Application.Appointments.Queries;

public class GetMyAppointmentsQueryHandler
    : IRequestHandler<GetMyAppointmentsQuery, List<MyAppointmentDto>>
{
    private readonly IAppDbContext _context;

    public GetMyAppointmentsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MyAppointmentDto>> Handle(
        GetMyAppointmentsQuery request,
        CancellationToken cancellationToken)
    {
        var userGuid = Guid.Parse(request.UserId);

        var query =
            from a in _context.Appointments.AsNoTracking()
            join patient in _context.Users
                on a.PatientId equals patient.Id
            join psychologist in _context.Users
                on a.PsychologistId equals psychologist.Id
            where a.PatientId == userGuid || a.PsychologistId == userGuid
            orderby a.StartTime
            select new MyAppointmentDto
            {
                AppointmentId = a.Id,
                PatientName = patient.FullName,
                PsychologistName = psychologist.FullName,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status.ToString()
            };

        return await query.ToListAsync(cancellationToken);
    }
}