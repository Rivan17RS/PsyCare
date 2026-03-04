using PsyCare.Domain.Enums;

namespace PsyCare.Domain.Entities;

public class Payment
{
    public Guid Id { get; private set; }
    public Guid AppointmentId { get; private set; }

    public decimal Amount { get; private set; }
    public decimal VatAmount { get; private set; }
    public decimal TotalAmount { get; private set; }

    public string ExternalReference { get; private set; }

    public PaymentStatus Status { get; private set; }

    private Payment() { }

    public Payment(Guid appointmentId, decimal amount, decimal vatAmount, string externalReference)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero.");

        Id = Guid.NewGuid();
        AppointmentId = appointmentId;
        Amount = amount;
        VatAmount = vatAmount;
        TotalAmount = amount + vatAmount;
        ExternalReference = externalReference;

        Status = PaymentStatus.Pending;
    }

    public void MarkAsPaid()
    {
        Status = PaymentStatus.Paid;
    }

    public void MarkAsFailed()
    {
        Status = PaymentStatus.Failed;
    }
}