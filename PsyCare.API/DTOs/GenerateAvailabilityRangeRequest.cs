public class GenerateAvailabilityRangeRequest
{
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int StartHour { get; set; }

    public int EndHour { get; set; }

    public int SlotMinutes { get; set; }
}