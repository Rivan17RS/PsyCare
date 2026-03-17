using Microsoft.AspNetCore.Authorization;
using RoleConstants = PsyCare.Domain.Common.Roles;
using PsyCare.Domain.Common;

namespace PsyCare.API.Security;

public class AuthorizeClinicAdminAttribute : AuthorizeAttribute
{
    public AuthorizeClinicAdminAttribute()
    {
        Roles = PsyCare.Domain.Common.Roles.ClinicAdmin;
    }
}

public class AuthorizePlatformAdminAttribute : AuthorizeAttribute
{
    public AuthorizePlatformAdminAttribute()
    {
        Roles = PsyCare.Domain.Common.Roles.PlatformAdmin;
    }
}

public class AuthorizePsychologistAttribute : AuthorizeAttribute
{
    public AuthorizePsychologistAttribute()
    {
        Roles = PsyCare.Domain.Common.Roles.Psychologist;
    }
}

public class AuthorizePatientAttribute : AuthorizeAttribute
{
    public AuthorizePatientAttribute()
    {
        Roles = PsyCare.Domain.Common.Roles.Patient;
    }
}

public class AuthorizePatientOrPsychologistAttribute : AuthorizeAttribute
{
    public AuthorizePatientOrPsychologistAttribute()
    {
        Roles = $"{PsyCare.Domain.Common.Roles.Patient},{PsyCare.Domain.Common.Roles.Psychologist}";
    }
}