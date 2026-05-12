namespace PsyCare.Application.Availability.Commands;

public class DeleteAvailabilityRangeResult
{
    public int Deleted { get; set; }

    public int PreservedBooked { get; set; }
}