using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Duely.X.Proxy;

[ApiController]
[Route("/x/proxy")]
public class ProxyController : ControllerBase
{
    public ProxyController()
    {
    }

    [HttpGet]
    public async Task Get([FromQuery] ProxyRequest proxyRequest)
    {
        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, proxyRequest);
    }
}

public class ProxyRequest
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(ProxyRequestHttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string>? Headers { get; set; }

    [JsonPropertyName("body")]
    public byte[]? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    public string? BodyEncoding { get; set; }
}

public class ProxyRequestHttpMethodJsonConverter : JsonConverter<HttpMethod>
{
    public override HttpMethod? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return new HttpMethod(reader.GetString()!);
    }

    public override void Write(Utf8JsonWriter writer, HttpMethod value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Method);
    }
}

public class ProxyRequestHttpMethodBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext.HttpContext.Request.Query.TryGetValue("method", out var method))
        {
            var httpMethod = method.Single().ToUpper() switch
            {
                "DELETE" => HttpMethod.Delete,
                "GET" => HttpMethod.Get,
                "HEAD" => HttpMethod.Head,
                "OPTIONS" => HttpMethod.Options,
                "PATCH" => HttpMethod.Patch,
                "POST" => HttpMethod.Post,
                "PUT" => HttpMethod.Put,
                "TRACE" => HttpMethod.Trace,
                _ => null
            };

            if (httpMethod is null)
            {
                bindingContext.ModelState.AddModelError(
                    nameof(ProxyRequest.Method),
                    $"'{method}' is not a valid value for 'method' parameter.");
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(httpMethod);
            }

        }

        return Task.CompletedTask;
    }
}

public class ProxyRequestBinderProvider : IModelBinderProvider
{
    public IModelBinder GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ContainerType == typeof(ProxyRequest))
        {
            if (context.Metadata.ModelType == typeof(HttpMethod))
            {
                return new BinderTypeModelBinder(typeof(ProxyRequestHttpMethodBinder));
            }
        }

        return null;
    }
}
