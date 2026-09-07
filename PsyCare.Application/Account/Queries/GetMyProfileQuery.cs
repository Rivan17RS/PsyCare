using MediatR;

namespace PsyCare.Application.Account.Queries.GetMyProfile;

public record GetMyProfileQuery(
    Guid UserId
) : IRequest<MyProfileDto?>;