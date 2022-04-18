using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace Duely.Connect.Proxy;

public class RequestTemplateSpec
{
    [JsonPropertyName("info")]
    public Uri? Info { get; set; }

    [JsonPropertyName("base")]
    public string[]? Base { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("query")]
    public Dictionary<string, string>? Query { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("body_encoding")]
    [BindProperty(Name = "body_encoding")]
    public string? BodyEncoding { get; set; }

    [JsonPropertyName("context")]
    public IDictionary<string, JsonNode?>? Context { get; set; }

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
}
