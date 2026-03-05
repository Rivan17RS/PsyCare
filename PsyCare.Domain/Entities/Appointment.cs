using PsyCare.Domain.Enums;

namespace PsyCare.Domain.Entities;

public class Appointment
{
    public Guid Id { get; private set; }
    public Guid PsychologistId { get; private set; }
    public Guid PatientId { get; private set; }

    public Guid TenantId { get; private set; }

    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }

    public AppointmentStatus Status { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }
    public AppointmentMode Mode { get; private set; }

    public string? MeetingLink { get; private set; }

    private Appointment() { }

    public Appointment(
        Guid tenantId,
        Guid psychologistId,
        Guid patientId,
        DateTime start,
        DateTime end,
        AppointmentMode mode)
    {
        if (end <= start)
            throw new ArgumentException("End time must be greater than start time");

        Id = Guid.NewGuid();
        TenantId = tenantId;
        PsychologistId = psychologistId;
        PatientId = patientId;
        StartTime = start;
        EndTime = end;
        Mode = mode;

        Status = AppointmentStatus.Pending;
        PaymentStatus = PaymentStatus.Pending;
    }

    public void MarkPaymentAsPaid()
    {
        PaymentStatus = PaymentStatus.Paid;
    }

    public void Confirm()
    {
        if (PaymentStatus != PaymentStatus.Paid)
            throw new InvalidOperationException("Cannot confirm unpaid appointment");

        Status = AppointmentStatus.Confirmed;
    }

    public void Cancel()
    {
        Status = AppointmentStatus.Cancelled;
    }

    public void AttachMeetingLink(string link)
    {
        if (Mode != AppointmentMode.Virtual)
            throw new InvalidOperationException("Meeting link only allowed for virtual sessions");

        MeetingLink = link;
    }
}