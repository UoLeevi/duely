using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.RequestProperties | HttpLoggingFields.ResponseStatusCode;
});

builder.AddControllersFromExternalAsseblies();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.UseHttpLogging();

app.Run();


internal static partial class WebApplicationBuilderExtensions
{
    internal static void AddControllersFromExternalAsseblies(this WebApplicationBuilder builder)
    {
        var applicationParts = builder.Services.AddControllers()
            .PartManager.ApplicationParts;

        var servicesAssemblyDirectoryPath = builder.Configuration.GetValue<string>("DUELY_X_SERVICES_ASSEMBLY_DIR");
        DirectoryInfo servicesDirectory = new DirectoryInfo(servicesAssemblyDirectoryPath);

        foreach (FileInfo asseblyFile in servicesDirectory.GetFiles("Duely.X.*.dll"))
        {
            var serviceAssebly = Assembly.LoadFrom(asseblyFile.FullName);
            applicationParts.Add(new AssemblyPart(serviceAssebly));
        }
    }
}
