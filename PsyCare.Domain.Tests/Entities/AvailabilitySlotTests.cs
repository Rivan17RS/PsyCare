using PsyCare.Domain.Entities;

namespace PsyCare.Domain.Tests.Entities;

public class AvailabilitySlotTests
{
    [Fact]
    public void Cannot_Create_Slot_With_Invalid_Time_Range()
    {
        Assert.Throws<ArgumentException>(() =>
            new AvailabilitySlot(Guid.NewGuid(), DateTime.UtcNow, DateTime.UtcNow));
    }

    [Fact]
    public void Cannot_Book_Already_Booked_Slot()
    {
        var slot = new AvailabilitySlot(
            Guid.NewGuid(),
            DateTime.UtcNow,
            DateTime.UtcNow.AddHours(1));

        slot.MarkAsBooked();

        Assert.Throws<InvalidOperationException>(() => slot.MarkAsBooked());
    }
}