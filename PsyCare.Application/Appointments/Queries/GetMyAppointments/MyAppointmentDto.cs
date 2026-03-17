namespace PsyCare.Application.Appointments.Queries;

public class MyAppointmentDto
{
    public Guid AppointmentId { get; set; }

    public string PatientName { get; set; } = default!;

    public string PsychologistName { get; set; } = default!;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string Status { get; set; } = default!;
}