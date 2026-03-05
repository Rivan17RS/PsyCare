using System.Security.Claims;

namespace PsyCare.API.Middlewares;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLower();

        // Allow public endpoints
        if (path != null &&
            (path.Contains("/auth/login") ||
             path.Contains("/auth/register") ||
             path.Contains("/swagger")))
        {
            await _next(context);
            return;
        }

        var tenantClaim = context.User?.FindFirst("tenantId");

        if (tenantClaim == null)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("TenantId missing in token.");
            return;
        }

        await _next(context);
    }
}