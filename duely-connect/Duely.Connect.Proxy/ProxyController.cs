using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;
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

        jsonSerializerOptions = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            WriteIndented = true
        };
    }

    private static readonly JsonSerializerOptions jsonSerializerOptions;

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

    [HttpGet("{id}")]
    public async Task Get(string id, [FromQuery] Dictionary<string, JsonNode?> context)
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

        var proxyRequest = new ProxyRequest(template!, context);
        HttpRequestMessage requestMessage;

        try
        {
            requestMessage = proxyRequest.CreateRequestMessage();
        }
        catch (Exception ex)
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new
            {
                message = ex.Message
            }, jsonSerializerOptions, HttpContext.RequestAborted);
            return;
        }

        using (requestMessage)
        {
            Response.StatusCode = 200;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, requestMessage, jsonSerializerOptions, HttpContext.RequestAborted);
            return;

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
}

public static class Utilities
{
    private static char[] simpleJsonPathSeparators = new[] { '.', '[', ']', '"' };

    public static string[] ParseSimpleJsonPath(string path)
    {
        // Let's keep it simple and assume that property names do not contain these separator characters
        // Also let's be very lax about "incorrectly" formatted path expressions
        return path.Split(simpleJsonPathSeparators, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    public static bool TryUpdateJsonNode(IDictionary<string, JsonNode?> jsonObject, string path, Func<JsonNode?, JsonNode?> update)
    {
        string[] propertyNames = ParseSimpleJsonPath(path);

        for (int i = 0; i < propertyNames.Length - 1; ++i)
        {
            string propertyName = propertyNames[i];

            if (!jsonObject.TryGetValue(propertyName, out var node)) node = null;

            if (node is null)
            {
                var newObjectNode = new JsonObject();
                jsonObject[propertyName] = newObjectNode;
                jsonObject = newObjectNode;
                continue;
            }

            if (node is JsonObject existingNodeObject)
            {
                jsonObject = existingNodeObject;
                continue;
            }

            // JsonObject node was expected
            return false;
        }

        string leafPropertyName = propertyNames[^1];

        if (!jsonObject.TryGetValue(leafPropertyName, out var leafNode)) leafNode = null;

        jsonObject[leafPropertyName] = update(leafNode);
        return true;
    }


    public static IDictionary<string, JsonNode?>? ParseQueryAsJsonObject(IQueryCollection query)
    {
        var jsonObject = new Dictionary<string, JsonNode?>();

        foreach (var item in query)
        {
            TryUpdateJsonNode(jsonObject, item.Key, (JsonNode? previousNode) =>
            {
                if (previousNode is null)
                {
                    if (item.Value.Count == 0) return null;
                    if (item.Value.Count == 1) return JsonValue.Create(item.Value[0]);
                    return new JsonArray(item.Value.Select(v => JsonValue.Create(v)).ToArray());
                }

                if (previousNode is JsonValue jsonValue)
                {
                    throw new NotImplementedException();
                }

                if (previousNode is JsonArray jsonArray)
                {
                    throw new NotImplementedException();
                }

                throw new NotImplementedException();
            });
        }

        return jsonObject;
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
