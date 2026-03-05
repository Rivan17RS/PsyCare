public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var tenant = context.Request.Headers["X-Tenant"];

        if (!string.IsNullOrEmpty(tenant))
        {
            context.Items["Tenant"] = tenant.ToString();
        }

        await _next(context);
    }
}