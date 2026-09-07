using PsyCare.Domain.Enums;

namespace PsyCare.Domain.Entities;

public class Tenant
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string Subdomain { get; private set; }

    public TenantType Type { get; private set; }

    private Tenant() { }

    public Tenant(
        string name,
        string subdomain,
        TenantType type = TenantType.Clinic)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Tenant name is required.",
                nameof(name));

        if (string.IsNullOrWhiteSpace(subdomain))
            throw new ArgumentException(
                "Tenant subdomain is required.",
                nameof(subdomain));

        Id = Guid.NewGuid();
        Name = name.Trim();
        Subdomain = subdomain.Trim().ToLowerInvariant();
        Type = type;
    }
}