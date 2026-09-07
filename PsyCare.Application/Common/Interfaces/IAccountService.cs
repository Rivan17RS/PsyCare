namespace PsyCare.Application.Common.Interfaces;

public interface IAccountService
{
    Task<AccountProfile?> GetMyProfileAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task UpdateMyProfileAsync(
        Guid userId,
        string fullName,
        string? phoneNumber,
        CancellationToken cancellationToken);
}

public class AccountProfile
{
    public Guid Id { get; init; }

    public string FullName { get; init; } = default!;

    public string Email { get; init; } = default!;

    public string? PhoneNumber { get; init; }
}