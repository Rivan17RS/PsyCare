using MediatR;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Application.Account.Commands.UpdateMyProfile;

public class UpdateMyProfileCommandHandler
    : IRequestHandler<UpdateMyProfileCommand>
{
    private readonly IAccountService _accountService;

    public UpdateMyProfileCommandHandler(
        IAccountService accountService)
    {
        _accountService = accountService;
    }

    public async Task Handle(
        UpdateMyProfileCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new InvalidOperationException(
                "Full name is required.");

        await _accountService.UpdateMyProfileAsync(
            request.UserId,
            request.FullName,
            request.PhoneNumber,
            cancellationToken);
    }
}