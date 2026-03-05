namespace PsyCare.API.DTOs;

public class RegisterRequest
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public Guid TenantId { get; set; }
}