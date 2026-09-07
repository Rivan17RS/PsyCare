using MediatR;

namespace PsyCare.Application.Account.Commands.UpdateMyProfile;

public record UpdateMyProfileCommand(
    Guid UserId,
    string FullName,
    string? PhoneNumber
) : IRequest;