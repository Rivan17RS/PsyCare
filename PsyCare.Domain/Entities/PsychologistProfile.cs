using PsyCare.Domain.Enums;

namespace PsyCare.Domain.Entities;

public class PsychologistProfile
{
    public Guid Id { get; private set; }

    public Guid TenantId { get; private set; }

    public Guid UserId { get; private set; }

    // Professional identity
    public string LegalIdentityNumber { get; private set; }

    public string ProfessionalLicense { get; private set; }

    public string Specialty { get; private set; }

    // Professional presentation
    public string? Biography { get; private set; }

    public Sex Sex { get; private set; }

    public string? ProfileImageUrl { get; private set; }

    private PsychologistProfile() { }

    public PsychologistProfile(
        Guid tenantId,
        Guid userId,
        string legalIdentityNumber,
        string professionalLicense,
        string specialty)
    {
        if (tenantId == Guid.Empty)
            throw new ArgumentException(
                "TenantId is required.",
                nameof(tenantId));

        if (userId == Guid.Empty)
            throw new ArgumentException(
                "UserId is required.",
                nameof(userId));

        if (string.IsNullOrWhiteSpace(legalIdentityNumber))
            throw new ArgumentException(
                "Legal identity number is required.",
                nameof(legalIdentityNumber));

        if (string.IsNullOrWhiteSpace(professionalLicense))
            throw new ArgumentException(
                "Professional license is required.",
                nameof(professionalLicense));

        if (string.IsNullOrWhiteSpace(specialty))
            throw new ArgumentException(
                "Specialty is required.",
                nameof(specialty));

        Id = Guid.NewGuid();

        TenantId = tenantId;
        UserId = userId;

        LegalIdentityNumber = legalIdentityNumber.Trim();
        ProfessionalLicense = professionalLicense.Trim();
        Specialty = specialty.Trim();

        Sex = Sex.Unspecified;
    }

    public void UpdatePersonalInformation(
        string? biography,
        Sex sex,
        string? profileImageUrl)
    {
        Biography = string.IsNullOrWhiteSpace(biography)
            ? null
            : biography.Trim();

        ProfileImageUrl =
            string.IsNullOrWhiteSpace(profileImageUrl)
                ? null
                : profileImageUrl.Trim();

        Sex = sex;
    }

    public void UpdateProfessionalInformation(
        string professionalLicense,
        string specialty)
    {
        if (string.IsNullOrWhiteSpace(professionalLicense))
            throw new ArgumentException(
                "Professional license is required.",
                nameof(professionalLicense));

        if (string.IsNullOrWhiteSpace(specialty))
            throw new ArgumentException(
                "Specialty is required.",
                nameof(specialty));

        ProfessionalLicense = professionalLicense.Trim();
        Specialty = specialty.Trim();
    }
}