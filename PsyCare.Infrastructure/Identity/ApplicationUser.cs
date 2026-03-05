using Microsoft.AspNetCore.Identity;

namespace PsyCare.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public Guid TenantId { get; set; }

    public string FullName { get; set; } = default!;
}