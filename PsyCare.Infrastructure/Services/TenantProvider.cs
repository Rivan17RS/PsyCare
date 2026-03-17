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
        var httpContext = _httpContextAccessor.HttpContext;

        if (httpContext == null)
            throw new Exception("HttpContext not available.");

        var tenantClaim = httpContext.User.FindFirst("tenantId");

        if (tenantClaim == null)
            throw new Exception("TenantId claim missing in JWT token.");

        if (!Guid.TryParse(tenantClaim.Value, out var tenantId))
            throw new Exception("Invalid TenantId in JWT.");

        return tenantId;
    }

}