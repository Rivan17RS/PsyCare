using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PsyCare.Domain.Entities;

namespace PsyCare.Infrastructure.Persistence.Configurations;

public class AvailabilitySlotConfiguration : IEntityTypeConfiguration<AvailabilitySlot>
{
    public void Configure(EntityTypeBuilder<AvailabilitySlot> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.StartTime)
               .IsRequired();

        builder.Property(s => s.EndTime)
               .IsRequired();

        builder.Property(s => s.IsBooked)
               .IsRequired();
    }
}