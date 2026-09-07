using MediatR;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Application.Account.Queries.GetMyProfile;

public class GetMyProfileQueryHandler
    : IRequestHandler<GetMyProfileQuery, MyProfileDto?>
{
    private readonly IAccountService _accountService;

    public GetMyProfileQueryHandler(
        IAccountService accountService)
    {
        _accountService = accountService;
    }

    public async Task<MyProfileDto?> Handle(
        GetMyProfileQuery request,
        CancellationToken cancellationToken)
    {
        var profile = await _accountService.GetMyProfileAsync(
            request.UserId,
            cancellationToken);

        if (profile == null)
            return null;

        return new MyProfileDto
        {
            Id = profile.Id,
            FullName = profile.FullName,
            Email = profile.Email,
            PhoneNumber = profile.PhoneNumber
        };
    }
}