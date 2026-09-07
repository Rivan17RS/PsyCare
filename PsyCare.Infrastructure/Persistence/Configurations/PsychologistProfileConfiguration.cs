using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Identity;

namespace PsyCare.Infrastructure.Persistence.Configurations;

public class PsychologistProfileConfiguration
    : IEntityTypeConfiguration<PsychologistProfile>
{
    public void Configure(
        EntityTypeBuilder<PsychologistProfile> builder)
    {
        builder.ToTable("PsychologistProfiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.LegalIdentityNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.ProfessionalLicense)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Specialty)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Biography)
            .HasMaxLength(2000);

        builder.Property(x => x.ProfileImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.Sex)
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();

        // A user has only one psychologist profile.
        builder.HasIndex(x => x.UserId)
            .IsUnique();

        // Tenant isolation / lookup.
        builder.HasIndex(x => x.TenantId);

        // ApplicationUser lives in Infrastructure, so the relationship
        // is configured here rather than in the Domain entity.
        builder.HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<PsychologistProfile>(
                x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Tenant>()
            .WithMany()
            .HasForeignKey(x => x.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}