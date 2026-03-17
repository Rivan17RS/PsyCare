using Microsoft.AspNetCore.Identity;

namespace PsyCare.Infrastructure.Identity;

public static class RoleSeeder
{
    public static async Task SeedRoles(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles =
        {
            "PlatformAdmin",
            "ClinicAdmin",
            "Psychologist",
            "Patient"
        };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>
                {
                    Name = role
                });
            }
        }
    }
}