namespace PsyCare.Domain.Entities;

public class Invitation
{
    public Guid Id { get; private set; }

    public string Email { get; private set; } = default!;

    public string Token { get; private set; } = default!;

    public Guid TenantId { get; private set; }

    public string Role { get; private set; } = default!;

    public DateTime ExpiresAt { get; private set; }

    public bool IsUsed { get; private set; }

    private Invitation() { }

    public Invitation(string email, Guid tenantId, string role)
    {
        Id = Guid.NewGuid();
        Email = email;
        TenantId = tenantId;
        Role = role;

        Token = Guid.NewGuid().ToString();

        ExpiresAt = DateTime.UtcNow.AddDays(3);
        IsUsed = false;
    }

    public void MarkAsUsed()
    {
        IsUsed = true;
    }
}