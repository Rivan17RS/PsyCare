using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Infrastructure.Storage;

public class LocalFileStorage : IFileStorage
{
    private readonly string _rootPath;

    public LocalFileStorage(string rootPath)
    {
        if (string.IsNullOrWhiteSpace(rootPath))
        {
            throw new ArgumentException(
                "Storage root path is required.",
                nameof(rootPath));
        }

        _rootPath = Path.GetFullPath(
            Path.Combine(
                Directory.GetCurrentDirectory(),
                rootPath));
    }

    public async Task<string> SaveAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(fileName);

        var generatedFileName =
            $"{Guid.NewGuid():N}{extension}";

        var profileImagesFolder = Path.Combine(
            _rootPath,
            "profile-images");

        Directory.CreateDirectory(profileImagesFolder);

        var filePath = Path.Combine(
            profileImagesFolder,
            generatedFileName);

        await using var outputStream = new FileStream(
            filePath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None);

        await fileStream.CopyToAsync(
            outputStream,
            cancellationToken);

        return Path.Combine(
            Path.GetFileName(_rootPath),
            "profile-images",
            generatedFileName)
            .Replace(
                Path.DirectorySeparatorChar,
                '/');
    }

    public Task DeleteAsync(
        string filePath,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            return Task.CompletedTask;
        }

        var relativePath = filePath
            .Replace(
                '/',
                Path.DirectorySeparatorChar);

        var fullPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            relativePath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        return Task.CompletedTask;
    }
}