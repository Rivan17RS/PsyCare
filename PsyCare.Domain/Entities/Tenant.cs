namespace PsyCare.Domain.Entities;

public class Tenant
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string Subdomain { get; private set; }

    private Tenant() { }

    public Tenant(string name, string subdomain)
    {
        Id = Guid.NewGuid();
        Name = name;
        Subdomain = subdomain;
    }
}