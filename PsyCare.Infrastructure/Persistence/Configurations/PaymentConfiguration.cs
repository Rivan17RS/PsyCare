using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PsyCare.Domain.Entities;

namespace PsyCare.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount)
               .HasColumnType("decimal(18,2)")
               .IsRequired();

        builder.Property(p => p.VatAmount)
               .HasColumnType("decimal(18,2)")
               .IsRequired();

        builder.Property(p => p.TotalAmount)
               .HasColumnType("decimal(18,2)")
               .IsRequired();

        builder.Property(p => p.ExternalReference)
               .HasMaxLength(200)
               .IsRequired();

        builder.Property(p => p.Status)
               .IsRequired();
    }
}