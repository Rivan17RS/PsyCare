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
        var tenantHeader = _httpContextAccessor
            .HttpContext?
            .Request
            .Headers["X-Tenant"]
            .FirstOrDefault();

        if (Guid.TryParse(tenantHeader, out var tenantId))
            return tenantId;

        throw new Exception("TenantId not found in request header.");
    }
}