using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PsyCare.Domain.Entities;

namespace PsyCare.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.StartTime)
               .IsRequired();

        builder.Property(a => a.EndTime)
               .IsRequired();

        builder.Property(a => a.Status)
               .IsRequired();

        builder.Property(a => a.PaymentStatus)
               .IsRequired();

        builder.Property(a => a.Mode)
               .IsRequired();

        builder.Property(a => a.MeetingLink)
               .HasMaxLength(500);
    }
}