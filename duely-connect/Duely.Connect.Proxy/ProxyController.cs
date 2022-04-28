using Duely.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
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

        ProxyRequest proxyRequest = new(template!, context);

        if (proxyRequest.Target is not null && !RequestTemplate.TryGet(proxyRequest.Target, out var targetTemplate))
        {
            Response.StatusCode = 400;
            Response.ContentType = "application/json";
            await JsonSerializer.SerializeAsync(Response.Body, new
            {
                message = $"Target template was not found: {proxyRequest.Target}"
            }, jsonSerializerOptions, HttpContext.RequestAborted);
            return;
        }

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

            if (targetTemplate is null)
            {

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
            else
            {
                using var httpClientForTarget = httpClientFactory.CreateClient();

                // TODO:

                var targetContext = proxyRequest.TargetContextMap.ToDictionary(
                    kvp => StringTemplate.Format(kvp.Key, proxyRequest.Context),
                    kvp => StringTemplate.Format(kvp.Value, proxyRequest.Context));
            }
        }
    }
}
