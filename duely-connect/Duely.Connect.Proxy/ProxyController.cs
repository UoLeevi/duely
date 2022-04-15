using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Web;

namespace Duely.Connect.Proxy;

[ApiController]
[Route("/proxy")]
public class ProxyController : ControllerBase
{
    static ProxyController()
    {
        DirectoryInfo templatesDirectory = new DirectoryInfo("../templates");

        var templateFiles = templatesDirectory.GetFiles("*.json");

        foreach (var templateFile in templateFiles)
        {
            using var stream = templateFile.OpenRead();
            var jsonDocument = JsonDocument.Parse(stream);

            if (jsonDocument.RootElement.ValueKind == JsonValueKind.Array)
            {
                var specs = jsonDocument.Deserialize<RequestTemplateSpec[]>();
                if (specs is not null)
                {
                    foreach (var spec in specs)
                    {
                        RequestTemplate.TryAdd(spec, out _);
                    }
                }
            }
            else
            {
                var spec = jsonDocument.Deserialize<RequestTemplateSpec>();
                if (spec is not null)
                {
                    RequestTemplate.TryAdd(spec, out _);
                }
            }
        }
    }

    private readonly IHttpClientFactory httpClientFactory;

    public ProxyController(IHttpClientFactory httpClientFactory)
    {
        this.httpClientFactory = httpClientFactory;
    }

    // https://connect.duely.app/oauth?state=state_name_test%3Dstate_value_test&error_subtype=access_denied&error=interaction_required
    // https://connect.duely.app/oauth?state=state_name_test%3Dstate_value_test&code=4/0AX4XfWhh5u1-ghPsnpArcPUE8I5Nvnz-G_6DrKxvyOpk3GXuKZLAx60k8H7QHfGtjo3QFg&scope=https://www.googleapis.com/auth/webmasters.readonly


    [HttpGet("~/oauth")]
    public async Task Get(string? code, string? scope, string? state, string? error, string? error_subtype)
    {
        if (code is null)
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new
            {
                message = "something went wrong",
                error = error,
                error_subtype = error_subtype
            });
            return;
        }

        Response.StatusCode = 200;
        Response.ContentType = "application/json";

        await JsonSerializer.SerializeAsync(Response.Body, new
        {
            message = "success"
        });
        return;
    }

    [HttpGet("template")]
    public async Task Get([FromQuery] RequestTemplateSpec spec)
    {
        if (spec.Id is not null)
        {
            spec.Id += "-" + Helpers.GenerateRandomKey();
        }

        if (!RequestTemplate.TryAdd(spec, out var template))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new { message = $"Base template does not exist." });
            return;
        }

        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, template, new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
        });
        return;
    }

    [HttpGet("{id}")]
    public async Task Get(string id, [FromQuery] Dictionary<string, JsonNode?> context)
    {
        if (!RequestTemplate.TryGet(id, out var template))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new { message = $"Template '{id}' was not found." });
            return;
        }

        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, template);
        return;

        var proxyRequest = template.Render(context);

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
    [JsonPropertyName("id")]
    public string Id { get; } = Helpers.GenerateRandomKey();

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    public string? BodyEncoding { get; set; }

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

public class RequestTemplateSpec
{
    [JsonPropertyName("info")]
    public Uri? Info { get; set; }

    [JsonPropertyName("base")]
    public string[]? Base { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    // see: https://en.wikipedia.org/wiki/URI_Template
    [JsonPropertyName("url_template")]
    [BindProperty(Name = "url_template")]
    public string? UrlTemplate { get; set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("header_templates")]
    [BindProperty(Name = "header_templates")]
    public Dictionary<string, string[]>? HeaderTemplates { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; set; }

    [JsonPropertyName("body_template")]
    [BindProperty(Name = "body_template")]
    public string? BodyTemplate { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    [BindProperty(Name = "body_encoding")]
    public string? BodyEncoding { get; set; }

    [JsonPropertyName("context")]
    public Dictionary<string, JsonNode?>? Context { get; set; }

    [JsonPropertyName("redirect_uri")]
    [BindProperty(Name = "redirect_uri")]
    public Uri? RedirectUri { get; set; }

    [JsonPropertyName("target")]
    public string? Target { get; set; }

    [JsonPropertyName("target_context_from_context")]
    [BindProperty(Name = "target_context_from_context")]
    public Dictionary<string, string>? TargetContextMap { get; set; }

    [JsonPropertyName("target_context_from_response")]
    [BindProperty(Name = "target_context_from_response")]
    public Dictionary<string, string>? TargetContextFromResponse { get; set; }

    internal static IDictionary<string, JsonNode?>? ParseQueryAsJsonObject(IQueryCollection query)
    {
        var dictionary = new Dictionary<string, JsonNode?>();

        foreach (var item in query)
        {
        }

        return dictionary;
    }
}

public class RequestTemplate
{
    private static ConcurrentDictionary<string, RequestTemplate> templates = new ConcurrentDictionary<string, RequestTemplate>();

    internal static bool TryGet(string id, out RequestTemplate? template)
    {
        return templates.TryGetValue(id, out template);
    }

    internal static bool TryAdd(RequestTemplateSpec spec, out RequestTemplate? template)
    {

        template = new RequestTemplate
        {
            Info = spec.Info,
            Id = spec.Id ?? Helpers.GenerateRandomKey(),
            UrlTemplate = spec.UrlTemplate,
            Url = spec.Url,
            Method = spec.Method,
            HeaderTemplates = spec.HeaderTemplates,
            Headers = spec.Headers,
            BodyTemplate = spec.BodyTemplate,
            Body = spec.Body,
            BodyEncoding = spec.BodyEncoding,
            Context = spec.Context,
            RedirectUri = spec.RedirectUri,
            Target = spec.Target,
            TargetContextMap = spec.TargetContextMap,
            TargetContextFromResponse = spec.TargetContextFromResponse
        };

        if (spec.Base is not null)
        {
            foreach (var id in spec.Base.Reverse())
            {
                if (!TryGet(id, out var baseTemplate))
                {
                    return false;
                }

                template.UpdateFromBase(baseTemplate!);
            }
        }

        return templates.TryAdd(template.Id, template);
    }

    private RequestTemplate() { }

    [JsonPropertyName("info")]
    public Uri? Info { get; private set; }

    [JsonPropertyName("id")]
    public string Id { get; private set; } = Helpers.GenerateRandomKey();

    // see: https://en.wikipedia.org/wiki/URI_Template
    [JsonPropertyName("url_template")]
    [BindProperty(Name = "url_template")]
    public string? UrlTemplate { get; private set; }

    [JsonPropertyName("url")]
    public Uri? Url { get; private set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; private set; }

    [JsonPropertyName("header_templates")]
    [BindProperty(Name = "header_templates")]
    public Dictionary<string, string[]>? HeaderTemplates { get; private set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; private set; }

    [JsonPropertyName("body_template")]
    [BindProperty(Name = "body_template")]
    public string? BodyTemplate { get; private set; }

    [JsonPropertyName("body")]
    public string? Body { get; private set; }

    [JsonPropertyName("body_encoding")]
    [BindProperty(Name = "body_encoding")]
    public string? BodyEncoding { get; private set; }

    [JsonPropertyName("context")]
    [JsonConverter(typeof(RequestTemplateContextJsonConverter))]
    public IDictionary<string, JsonNode?>? Context { get; private set; }

    [JsonPropertyName("redirect_uri")]
    [BindProperty(Name = "redirect_uri")]
    public Uri? RedirectUri { get; private set; }

    [JsonPropertyName("target")]
    public string? Target { get; private set; }

    [JsonPropertyName("target_context_from_context")]
    [BindProperty(Name = "target_context_from_context")]
    public Dictionary<string, string>? TargetContextMap { get; private set; }

    [JsonPropertyName("target_context_from_response")]
    [BindProperty(Name = "target_context_from_response")]
    public Dictionary<string, string>? TargetContextFromResponse { get; private set; }

    private void UpdateFromBase(RequestTemplate baseTemplate)
    {
        UrlTemplate ??= baseTemplate.UrlTemplate;
        Url ??= baseTemplate.Url;
        Method ??= baseTemplate.Method;
        HeaderTemplates ??= baseTemplate.HeaderTemplates;
        Headers ??= baseTemplate.Headers;
        BodyTemplate ??= baseTemplate.BodyTemplate;
        Body ??= baseTemplate.Body;
        BodyEncoding ??= baseTemplate.BodyEncoding;
        Context ??= baseTemplate.Context;
        RedirectUri ??= baseTemplate.RedirectUri;
        Target ??= baseTemplate.Target;
        TargetContextMap ??= baseTemplate.TargetContextMap;
        TargetContextFromResponse ??= baseTemplate.TargetContextFromResponse;

        if (HeaderTemplates != baseTemplate.HeaderTemplates && baseTemplate.HeaderTemplates is not null)
        {
            foreach (var header in baseTemplate.HeaderTemplates)
            {
                HeaderTemplates!.TryAdd(header.Key, header.Value);
            }
        }

        if (Headers != baseTemplate.Headers && baseTemplate.Headers is not null)
        {
            foreach (var header in baseTemplate.Headers)
            {
                Headers!.TryAdd(header.Key, header.Value);
            }
        }

        if (Context != baseTemplate.Context && baseTemplate.Context is not null)
        {
            foreach (var item in baseTemplate.Context)
            {
                Context!.TryAdd(item.Key, item.Value);
            }
        }

        if (TargetContextMap != baseTemplate.TargetContextMap && baseTemplate.TargetContextMap is not null)
        {
            foreach (var item in baseTemplate.TargetContextMap)
            {
                TargetContextMap!.TryAdd(item.Key, item.Value);
            }
        }

        if (TargetContextFromResponse != baseTemplate.TargetContextFromResponse && baseTemplate.TargetContextFromResponse is not null)
        {
            foreach (var item in baseTemplate.TargetContextFromResponse)
            {
                TargetContextFromResponse!.TryAdd(item.Key, item.Value);
            }
        }
    }

    public ProxyRequest Render(Dictionary<string, JsonNode?> context)
    {
        var proxyRequest = new ProxyRequest
        {
            Url = Url,
            Method = Method,
            Headers = Headers,
            Body = Body
        };

        if (Url is null && UrlTemplate is not null)
        {
            var urlString = TemplateEnginge.Render(UrlTemplate, context);
            proxyRequest.Url = new Uri(urlString);
        }

        if (HeaderTemplates is not null)
        {
            if (proxyRequest.Headers is null)
            {
                proxyRequest.Headers = new Dictionary<string, string[]>();
            }

            foreach (var headerTemplate in HeaderTemplates)
            {
                var headerKey = TemplateEnginge.Render(headerTemplate.Key, context);
                var headerValues = headerTemplate.Value.Select(v => TemplateEnginge.Render(v, context));
                var previousValues = proxyRequest.Headers[headerKey];

                if (previousValues is not null)
                {
                    headerValues = previousValues.Concat(headerValues);
                }

                proxyRequest.Headers[headerKey] = headerValues.ToArray();
            }
        }

        if (Body is null && BodyTemplate is not null)
        {
            proxyRequest.Body = TemplateEnginge.Render(BodyTemplate, context);
        }

        return proxyRequest;
    }
}

// TODO: replace with some proper implementation
public static class TemplateEnginge
{
    public static string Render(string template, Dictionary<string, JsonNode?> context)
    {
        foreach (var item in context)
        {
            template = template.Replace("{{" + item.Key + "}}", item.Value?.ToString());
        }

        return template;
    }
}


public class RequestTemplateContextJsonConverter : JsonConverter<IDictionary<string, JsonNode?>>
{
    public override Dictionary<string, JsonNode?>? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return null;
    }

    public override void Write(Utf8JsonWriter writer, IDictionary<string, JsonNode?> value, JsonSerializerOptions options)
    {
        WriteObject(writer, value, options);

        static void WriteValue(Utf8JsonWriter writer, JsonNode? value, JsonSerializerOptions options)
        {
            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            if (value is JsonObject jsonObject)
            {
                WriteObject(writer, jsonObject, options);
                return;
            }

            if (value is JsonArray jsonArray)
            {
                WriteArray(writer, jsonArray, options);
                return;
            }

            writer.WriteRawValue(value.ToString());
        }

        static void WriteProperty(Utf8JsonWriter writer, string propertyName, JsonNode? value, JsonSerializerOptions options)
        {
            writer.WritePropertyName(propertyName);

            // Values for properties with name that starts with an underscore should be masked
            if (propertyName.StartsWith("_"))
            {
                writer.WriteStringValue("***");
                return;
            }

            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            if (value is JsonObject jsonObject)
            {
                WriteObject(writer, jsonObject, options);
                return;
            }

            if (value is JsonArray jsonArray)
            {
                WriteArray(writer, jsonArray, options);
                return;
            }

            writer.WriteRawValue(value.ToString());
        }

        static void WriteObject(Utf8JsonWriter writer, IDictionary<string, JsonNode?> value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();

            foreach (var item in value)
            {
                WriteProperty(writer, item.Key, item.Value, options);
            }

            writer.WriteEndObject();
        }

        static void WriteArray(Utf8JsonWriter writer, JsonArray value, JsonSerializerOptions options)
        {
            writer.WriteStartArray();

            foreach (var item in value)
            {
                WriteValue(writer, item, options);
            }

            writer.WriteEndArray();
        }
    }
}

public class HttpMethodJsonConverter : JsonConverter<HttpMethod>
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

public class RequestTemplateSpecHttpMethodBinder : IModelBinder
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
                    nameof(RequestTemplate.Method),
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

public class RequestTemplateSpecContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var context = RequestTemplateSpec.ParseQueryAsJsonObject(bindingContext.HttpContext.Request.Query)?["context"]?.AsObject();
        bindingContext.Result = ModelBindingResult.Success(context);

        return Task.CompletedTask;
    }
}

public class ProxyRequestContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var context = RequestTemplateSpec.ParseQueryAsJsonObject(bindingContext.HttpContext.Request.Query);
        bindingContext.Result = ModelBindingResult.Success(context);

        return Task.CompletedTask;
    }
}

public class ProxyControllerBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ContainerType == typeof(RequestTemplateSpec))
        {
            if (context.Metadata.ModelType == typeof(HttpMethod))
            {
                return new BinderTypeModelBinder(typeof(RequestTemplateSpecHttpMethodBinder));
            }

            if (context.Metadata.PropertyName == nameof(RequestTemplateSpec.Context))
            {
                return new BinderTypeModelBinder(typeof(RequestTemplateSpecContextBinder));
            }
        }

        if (context.Metadata.ModelType == typeof(Dictionary<string, JsonNode?>) && context.Metadata.Name == "context")
        {
            return new BinderTypeModelBinder(typeof(ProxyRequestContextBinder));
        }

        return null;
    }
}


public static class Helpers
{
    public static string GenerateRandomKey(int length = 24)
    {
        var bytes = RandomNumberGenerator.GetBytes(length);
        return Base64UrlTextEncoder.Encode(bytes);
    }
}
