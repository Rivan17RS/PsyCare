using MediatR;
using Microsoft.EntityFrameworkCore;
using PsyCare.Application.Common.Interfaces;
using PsyCare.Application.Appointments.Queries;

public class GetAppointmentHistoryQueryHandler
    : IRequestHandler<GetAppointmentHistoryQuery, List<MyAppointmentDto>>
{
    private readonly IAppDbContext _context;

    public GetAppointmentHistoryQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MyAppointmentDto>> Handle(
        GetAppointmentHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var userGuid = Guid.Parse(request.UserId);

        // 🇨🇷 Costa Rica midnight → UTC conversion
        var costaRicaNow = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
            DateTime.UtcNow,
            "Central America Standard Time"
        );

        var todayMidnightCR = new DateTime(
            costaRicaNow.Year,
            costaRicaNow.Month,
            costaRicaNow.Day,
            0, 0, 0
        );

        var todayMidnightUtc = TimeZoneInfo.ConvertTimeToUtc(
            todayMidnightCR,
            TimeZoneInfo.FindSystemTimeZoneById("Central America Standard Time")
        );

        var query =
            from a in _context.Appointments.AsNoTracking()
            join patient in _context.Users on a.PatientId equals patient.Id
            join psychologist in _context.Users on a.PsychologistId equals psychologist.Id
            where (a.PatientId == userGuid || a.PsychologistId == userGuid)
                  && a.StartTime < todayMidnightUtc
            orderby a.StartTime descending
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