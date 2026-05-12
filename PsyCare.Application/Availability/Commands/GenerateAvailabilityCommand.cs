namespace PsyCare.Application.Availability.Commands;

using MediatR;

public class GenerateAvailabilityCommand : IRequest<GenerateAvailabilityResult>
{
    public Guid TenantId { get; set; }

    public Guid PsychologistId { get; set; }

    public DateTime Date { get; set; }

    public TimeSpan StartHour { get; set; }

    public TimeSpan EndHour { get; set; }

    public int DurationMinutes { get; set; }
}

public class GenerateAvailabilityResult
{
    public int Created { get; set; }

    public int Skipped { get; set; }
}