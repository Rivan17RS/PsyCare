namespace PsyCare.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; private set; }
    public Guid PsychologistId { get; private set; }

    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }

    public bool IsBooked { get; private set; }

    private AvailabilitySlot() { }

    public AvailabilitySlot(Guid psychologistId, DateTime startTime, DateTime endTime)
    {
        if (endTime <= startTime)
            throw new ArgumentException("End time must be greater than start time.");

        Id = Guid.NewGuid();
        PsychologistId = psychologistId;
        StartTime = startTime;
        EndTime = endTime;
        IsBooked = false;
    }

    public void MarkAsBooked()
    {
        if (IsBooked)
            throw new InvalidOperationException("This slot is already booked.");

        IsBooked = true;
    }
}