using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Infrastructure.Services;

public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetTenantId()
    {
        var tenantClaim = _httpContextAccessor
            .HttpContext?
            .User?
            .FindFirst("tenantId");

        if (tenantClaim == null)
            throw new Exception("TenantId claim missing in JWT token.");

        return Guid.Parse(tenantClaim.Value);
    }
}