using Microsoft.AspNetCore.Mvc.ApplicationParts;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddControllersFromExternalAsseblies();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();


internal static partial class WebApplicationBuilderExtensions
{
    internal static void AddControllersFromExternalAsseblies(this WebApplicationBuilder builder)
    {
        var applicationParts = builder.Services.AddControllers()
            .PartManager.ApplicationParts;

        var servicesAssemblyDirectoryPath = builder.Configuration.GetValue<string>("DUELY_X_SERVICES_ASSEMBLY_DIR");
        DirectoryInfo servicesDirectory = new DirectoryInfo(servicesAssemblyDirectoryPath);

        if (!servicesDirectory.Exists)
        {
            Console.WriteLine($"Directory '{servicesAssemblyDirectoryPath}' does not exist");
            return;
        }

        foreach (FileInfo asseblyFile in servicesDirectory.GetFiles("Duely.X.*.dll"))
        {
            var serviceAssebly = Assembly.LoadFrom(asseblyFile.FullName);
            applicationParts.Add(new AssemblyPart(serviceAssebly));
        }
    }
}
