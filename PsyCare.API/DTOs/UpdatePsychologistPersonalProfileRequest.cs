using PsyCare.Domain.Enums;

namespace PsyCare.API.DTOs;

public class UpdatePsychologistPersonalProfileRequest
{
    public string? Biography { get; set; }

    public Sex Sex { get; set; }

    public string? ProfileImageUrl { get; set; }
}