namespace PsyCare.Application.Availability.Queries;

public class AvailabilityDayDto
{
    public DateTime Date { get; set; }

    public List<AvailabilitySlotDto> Slots { get; set; }
        = new();
}