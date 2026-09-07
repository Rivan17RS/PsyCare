namespace PsyCare.API.DTOs;

public class UpdateMyProfileRequest
{
    public string FullName { get; set; } = default!;

    public string? PhoneNumber { get; set; }
}