using Microsoft.AspNetCore.Identity;
using PsyCare.Domain.Common;

namespace PsyCare.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles =
        {
            Roles.PlatformAdmin,
            Roles.ClinicAdmin,
            Roles.Psychologist,
            Roles.Patient
        };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}