public class GenerateAvailabilitySlotsRequest
{
    public DateTime Date { get; set; }

    public int StartHour { get; set; }

    public int EndHour { get; set; }

    public int SlotMinutes { get; set; }
}