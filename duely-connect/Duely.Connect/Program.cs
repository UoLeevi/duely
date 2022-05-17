using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Npgsql;
using System.Data;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHttpClient();

builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.RequestProperties | HttpLoggingFields.ResponseStatusCode;
});

builder.AddControllersFromExternalAsseblies();

builder.Services.AddSingleton<Func<Task<IDbConnection>>>((serviceProvider) =>

     async () =>
     {
         var connection = new NpgsqlConnection();
         await connection.OpenAsync();
         return connection;
     }

);

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.UseHttpLogging();

app.Run();


internal static partial class WebApplicationBuilderExtensions
{
    internal static void AddControllersFromExternalAsseblies(this WebApplicationBuilder builder)
    {
        var servicesAssemblyDirectoryPath = builder.Configuration.GetValue<string>("DUELY_CONNECT_SERVICES_ASSEMBLY_DIR");
        DirectoryInfo servicesDirectory = new DirectoryInfo(servicesAssemblyDirectoryPath);

        var serviceAssemblies = servicesDirectory.GetFiles("Duely.Connect.*.dll")
            .Select(assemblyFile => Assembly.LoadFrom(assemblyFile.FullName))
            .ToList();

        var mvcBuilder = builder.Services.AddControllers(options =>
        {
            var modelBinderProviders = serviceAssemblies
                .SelectMany(serviceAssembly => serviceAssembly.GetExportedTypes())
                .Where(p => typeof(IModelBinderProvider).IsAssignableFrom(p) && p.IsClass && !p.IsAbstract)
                .Select((p) => p.GetConstructor(Type.EmptyTypes)?.Invoke(Array.Empty<object>()))
                .OfType<IModelBinderProvider>()
                .ToList();

            modelBinderProviders.ForEach(p => options.ModelBinderProviders.Insert(0, p));
        });

        var applicationParts = mvcBuilder.PartManager.ApplicationParts;
        serviceAssemblies.ForEach(serviceAssembly => applicationParts.Add(new AssemblyPart(serviceAssembly)));
    }
}
