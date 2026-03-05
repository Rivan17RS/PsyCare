using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using PsyCare.Application.Common.Interfaces;
using PsyCare.Domain.Entities;
using PsyCare.Infrastructure.Identity;

namespace PsyCare.Infrastructure.Persistence;

public class AppDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    private readonly ITenantProvider _tenantProvider;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        ITenantProvider tenantProvider)
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    private Guid CurrentTenantId => _tenantProvider.GetTenantId();

    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<AvailabilitySlot> AvailabilitySlots => Set<AvailabilitySlot>();
    public DbSet<Tenant> Tenants => Set<Tenant>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global Tenant Filters
        builder.Entity<Appointment>()
            .HasQueryFilter(a => a.TenantId == CurrentTenantId);

        builder.Entity<AvailabilitySlot>()
            .HasQueryFilter(a => a.TenantId == CurrentTenantId);

        builder.Entity<Payment>()
            .HasQueryFilter(p => p.TenantId == CurrentTenantId);
    }
}