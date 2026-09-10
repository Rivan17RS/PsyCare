public class RegisterPsychologistRequest
{
    public string Token { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string LegalIdentityNumber { get; set; } = default!;
    public string ProfessionalLicense { get; set; } = default!;
    public string Specialty { get; set; } = default!;
    public string Password { get; set; } = default!;
}