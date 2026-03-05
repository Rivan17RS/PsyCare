using Microsoft.AspNetCore.Identity;

namespace PsyCare.Domain.Entities;

public class ApplicationUser : IdentityUser<string>
{
    public Guid TenantId { get; set; }

    public string FullName { get; set; } = default!;
}