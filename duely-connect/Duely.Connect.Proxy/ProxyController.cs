using Duely.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace Duely.Connect.Proxy;

[ApiController]
[Route("/proxy")]
public class ProxyController : ControllerBase
{
    static ProxyController()
    {
        DirectoryInfo templatesDirectory = new("../templates");

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

    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
    };

    // TODO: Replace with database
    private static readonly IDictionary<string, (string requestJson, string responseJson)> requests = new ConcurrentDictionary<string, (string requestJson, string responseJson)>();

    private readonly IHttpClientFactory httpClientFactory;

    public ProxyController(IHttpClientFactory httpClientFactory)
    {
        this.httpClientFactory = httpClientFactory;
    }

    // https://connect.duely.app/oauth?state=state_name_test%3Dstate_value_test&error_subtype=access_denied&error=interaction_required
    // https://connect.duely.app/oauth?state=state_name_test%3Dstate_value_test&code=4/0AX4XfWhh5u1-ghPsnpArcPUE8I5Nvnz-G_6DrKxvyOpk3GXuKZLAx60k8H7QHfGtjo3QFg&scope=https://www.googleapis.com/auth/webmasters.readonly


    [HttpGet("~/oauth")]
    public async Task GetOauth(string? code, string? scope, string? state, string? error, string? error_subtype)
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
            }, jsonSerializerOptions, HttpContext.RequestAborted);
            return;
        }

        Response.StatusCode = 200;
        Response.ContentType = "application/json";

        await JsonSerializer.SerializeAsync(Response.Body, new
        {
            message = "success"
        }, jsonSerializerOptions, HttpContext.RequestAborted);
        return;
    }

    [HttpGet("template")]
    public async Task GetTemplate([FromQuery] RequestTemplateSpec spec)
    {
        if (spec.Id is not null)
        {
            spec.Id += "-" + CryptoHelpers.GenerateRandomKey();
        }

        if (!RequestTemplate.TryAdd(spec, out var template))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new
            {
                message = $"Base template does not exist."
            }, jsonSerializerOptions, HttpContext.RequestAborted);
            return;
        }

        Response.StatusCode = 200;
        Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(Response.Body, template, jsonSerializerOptions, HttpContext.RequestAborted);
        return;
    }

    // To prevent prevent infitite loops etc.
    const int maxNestedRequests = 8;

    private async Task<HttpResponseMessage> RequestAsync(RequestTemplate template, IDictionary<string, JsonNode?> context, int depth = 1)
    {
        if (depth > maxNestedRequests) throw new InvalidOperationException($"Maximum request depth reached");

        ProxyRequest proxyRequest = new(template!, context);
        RequestTemplate? targetTemplate = null;

        if (proxyRequest.Target is not null && !RequestTemplate.TryGet(proxyRequest.Target, out targetTemplate))
        {
            throw new InvalidOperationException($"Target template was not found: {proxyRequest.Target}");
        }

        using (HttpRequestMessage requestMessage = proxyRequest.CreateRequestMessage())
        {
            using var httpClient = httpClientFactory.CreateClient();

            HttpResponseMessage responseMessage = await httpClient.SendAsync(requestMessage, HttpContext.RequestAborted);

            // Store request and response
            requests.Add(proxyRequest.Id, (JsonSerializer.Serialize(proxyRequest), JsonSerializer.Serialize(responseMessage)));

            if (targetTemplate is not null)
            {
                Dictionary<string, JsonNode?> targetContext = new();

                foreach (var kvp in proxyRequest.TargetContextFromResponse)
                {
                    var key = StringTemplate.Format(kvp.Key, proxyRequest.Context);
                    if (string.IsNullOrEmpty(key)) continue;

                    var value = StringTemplate.Format(kvp.Value, proxyRequest.Context);
                    if (string.IsNullOrEmpty(value)) continue;
                    targetContext[key] = value;
                }

                if (responseMessage.Content.Headers.ContentType?.MediaType?.StartsWith("application/json") is true)
                {
                    using Stream responseStream = await responseMessage.Content.ReadAsStreamAsync();
                    JsonNode? responseJson = JsonNode.Parse(responseStream);

                    if (responseJson is not null)
                    {
                        foreach (var kvp in proxyRequest.TargetContextFromResponse)
                        {
                            var key = StringTemplate.Format(kvp.Key, proxyRequest.Context);

                            if (string.IsNullOrEmpty(key)) continue;

                            var value = JsonPath.GetNode(responseJson, JsonPath.GetPropertyNamesFromPath(kvp.Value));
                            if (value is null) continue;
                            targetContext[key] = value;
                        }
                    }
                }

                responseMessage.Dispose();
                responseMessage = await RequestAsync(targetTemplate, targetContext, depth + 1);

            }

            return responseMessage;
        }
    }

    [HttpGet("{id}")]
    public async Task Get(string id, [FromQuery] IDictionary<string, JsonNode?> context)
    {
        if (!RequestTemplate.TryGet(id, out var template))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new
            {
                message = $"Template was not found: {id}"
            }, jsonSerializerOptions, HttpContext.RequestAborted);
            return;
        }

        using var responseMessage = await RequestAsync(template!, context);

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
