namespace PsyCare.Application.Common.Interfaces;

public interface ITenantProvider
{
    Guid GetTenantId();
}