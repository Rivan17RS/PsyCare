namespace PsyCare.Application.Availability.Queries;

public class AvailabilitySlotDto
{
    public Guid Id { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public bool IsBooked { get; set; }
}