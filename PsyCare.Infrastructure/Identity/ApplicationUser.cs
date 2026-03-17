using Microsoft.AspNetCore.Identity;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>, IUser
{
    public Guid TenantId { get; set; }

    public string FullName { get; set; } = default!;
}