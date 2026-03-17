namespace PsyCare.Application.Common.Interfaces;

public interface IUser
{
    Guid Id { get; }
    string FullName { get; }
}