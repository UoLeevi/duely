using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace Duely.X.Proxy;

[ApiController]
[Route("/x/proxy")]
public class ProxyController : ControllerBase
{
    private static IDictionary<string, ProxyRequestTemplate> requestTemplates = new ConcurrentDictionary<string, ProxyRequestTemplate>();

    private readonly IHttpClientFactory httpClientFactory;

    public ProxyController(IHttpClientFactory httpClientFactory)
    {
        this.httpClientFactory = httpClientFactory;
    }

    [HttpGet("template")]
    public async Task Get([FromQuery] ProxyRequestTemplate requestTemplate)
    {
        if (requestTemplate.Id is null)
        {
            requestTemplate.Id = Guid.NewGuid().ToString();
        }

        requestTemplates[requestTemplate.Id] = requestTemplate;

        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, requestTemplate);
        return;
    }

    [HttpGet("{id}")]
    public async Task Get(string id, [FromQuery] JsonObject context)
    {

        if (!requestTemplates.TryGetValue(id, out var requestTemplate))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new { message = $"Template '{id}' was not found." });
            return;
        }

        var proxyRequest = requestTemplate.Render(context);

        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, proxyRequest);
        return;

        if (!proxyRequest.Validate(out var message))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new { message = message });
            return;
        }

        using var requestMessage = new HttpRequestMessage
        {
            RequestUri = proxyRequest.Url,
            Method = proxyRequest.Method ?? HttpMethod.Get,
        };

        if (proxyRequest.Body is not null)
        {
            requestMessage.Content = new StringContent(proxyRequest.Body);
        }

        if (proxyRequest.Headers is not null)
        {
            foreach (var header in proxyRequest.Headers)
            {

                if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value) && requestMessage.Content != null)
                {
                    requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value);
                }
            }
        }

        using var httpClient = httpClientFactory.CreateClient();

        using var responseMessage = await httpClient.SendAsync(requestMessage, HttpContext.RequestAborted);

        Response.StatusCode = (int)responseMessage.StatusCode;
        foreach (var header in responseMessage.Headers)
        {
            Response.Headers[header.Key] = header.Value.ToArray();
        }

        foreach (var header in responseMessage.Content.Headers)
        {
            Response.Headers[header.Key] = header.Value.ToArray();
        }

        // SendAsync removes chunking from the response. This removes the header so it doesn't expect a chunked response.
        Response.Headers.Remove("transfer-encoding");

        using (var responseStream = await responseMessage.Content.ReadAsStreamAsync())
        {
            await responseStream.CopyToAsync(Response.Body, HttpContext.RequestAborted);
        }
    }
}

public class ProxyRequest
{
    [JsonPropertyName("id_template")]
    public string? IdTemplate { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("url_template")]
    public string? UrlTemplate { get; set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(ProxyRequestHttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("header_templates")]
    public Dictionary<string, string[]>? HeaderTemplates { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; set; }

    [JsonPropertyName("body_template")]
    public string? BodyTemplate { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    public string? BodyEncoding { get; set; }

    [JsonPropertyName("prepare")]
    public bool? Prepared { get; set; }

    internal bool Validate(out string? message)
    {
        if (Url is null)
        {
            message = "URL is required";
            return false;
        }

        if (!Url.IsAbsoluteUri)
        {
            message = "Absolute URL is required";
            return false;
        }

        if (Url.Scheme != "http" && Url.Scheme != "https")
        {
            message = "URL must use 'http' or 'https' scheme";
            return false;
        }

        if (Url.IsLoopback)
        {
            message = $"URL '{Url}' is not allowed.";
            return false;
        }

        if (Url.HostNameType != UriHostNameType.Dns)
        {
            message = $"URL '{Url}' is not allowed.";
            return false;
        }

        message = null;
        return true;
    }
}

public class ProxyRequestTemplate
{
    [JsonPropertyName("id_template")]
    public string? IdTemplate { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("url_template")]
    public string? UrlTemplate { get; set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(ProxyRequestHttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("header_templates")]
    public Dictionary<string, string[]>? HeaderTemplates { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; set; }

    [JsonPropertyName("body_template")]
    public string? BodyTemplate { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    public string? BodyEncoding { get; set; }

    [JsonPropertyName("prepare")]
    public bool? Prepared { get; set; }

    public ProxyRequest Render(JsonObject context)
    {
        if (Id is null && IdTemplate is not null)
        {
            Id = TemplateEnginge.Render(IdTemplate, context);
        }

        if (Url is null && UrlTemplate is not null)
        {
            var urlString = TemplateEnginge.Render(UrlTemplate, context);
            Url = new Uri(urlString);
        }

        if (HeaderTemplates is not null)
        {
            if (Headers is null)
            {
                Headers = new Dictionary<string, string[]>();
            }

            foreach (var headerTemplate in HeaderTemplates)
            {
                var headerKey = TemplateEnginge.Render(headerTemplate.Key, context);
                var headerValues = headerTemplate.Value.Select(v => TemplateEnginge.Render(v, context));
                var previousValues = Headers[headerKey];

                if (previousValues is not null)
                {
                    headerValues = previousValues.Concat(headerValues).ToArray();
                }

                Headers[headerKey] = headerValues.ToArray();
            }
        }

        if (Body is null && BodyTemplate is not null)
        {
            Body = TemplateEnginge.Render(BodyTemplate, context);
        }

        return new ProxyRequest
        {
            Id = Id,
            Url = Url,
            Method = Method,
            Headers = Headers,
            Body = Body
        };
    }
}

// TODO: replace with some proper implementation
public static class TemplateEnginge
{
    public static string Render(string template, JsonObject context)
    {
        foreach (var item in context)
        {
            template = template.Replace("{{" + item.Key + "}}", item.Value?.ToString());
        }

        return template;
    }
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
                    nameof(ProxyRequestTemplate.Method),
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
        if (context.Metadata.ContainerType == typeof(ProxyRequestTemplate))
        {
            if (context.Metadata.ModelType == typeof(HttpMethod))
            {
                return new BinderTypeModelBinder(typeof(ProxyRequestHttpMethodBinder));
            }
        }

        return null;
    }
}
