public class RegisterClinicRequest
{
    public string ClinicName { get; set; } = default!;
    public string Subdomain { get; set; } = default!;

    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FullName { get; set; } = default!;
}