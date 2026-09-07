using Microsoft.AspNetCore.Identity;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Infrastructure.Identity;

public class AccountService : IAccountService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountService(
        UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<AccountProfile?> GetMyProfileAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(
            userId.ToString());

        if (user == null)
            return null;

        return new AccountProfile
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber
        };
    }

    public async Task UpdateMyProfileAsync(
        Guid userId,
        string fullName,
        string? phoneNumber,
        CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(
            userId.ToString());

        if (user == null)
            throw new InvalidOperationException(
                "User not found.");

        user.FullName = fullName.Trim();

        user.PhoneNumber =
            string.IsNullOrWhiteSpace(phoneNumber)
                ? null
                : phoneNumber.Trim();

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                "; ",
                result.Errors.Select(e => e.Description));

            throw new InvalidOperationException(
                $"Unable to update profile: {errors}");
        }
    }
}