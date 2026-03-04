using PsyCare.Domain.Entities;

namespace PsyCare.Domain.Tests.Entities;

public class PaymentTests
{
    [Fact]
    public void Cannot_Create_Payment_With_Invalid_Amount()
    {
        Assert.Throws<ArgumentException>(() =>
            new Payment(Guid.NewGuid(), 0, 0, "ref"));
    }

    [Fact]
    public void Payment_Can_Be_Marked_As_Paid()
    {
        var payment = new Payment(Guid.NewGuid(), 100, 4, "ref");

        payment.MarkAsPaid();

        Assert.Equal(PsyCare.Domain.Enums.PaymentStatus.Paid, payment.Status);
    }
}