namespace PsyCare.API.DTOs;

public class InvitationDetailsResponse
{
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
}