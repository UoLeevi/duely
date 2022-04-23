using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Duely.Utilities;

namespace Duely.Connect.Proxy;

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
            Id = spec.Id ?? CryptoHelpers.GenerateRandomKey(),
            Url = spec.Url,
            Query = spec.Query,
            Method = spec.Method,
            Headers = spec.Headers,
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
    public string Id { get; private set; } = CryptoHelpers.GenerateRandomKey();

    [JsonPropertyName("url")]
    public string? Url { get; private set; }

    [JsonPropertyName("query")]
    public Dictionary<string, string>? Query { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; private set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string[]>? Headers { get; private set; }

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
        Url ??= baseTemplate.Url;
        Query ??= baseTemplate.Query;
        Method ??= baseTemplate.Method;
        Headers ??= baseTemplate.Headers;
        Body ??= baseTemplate.Body;
        BodyEncoding ??= baseTemplate.BodyEncoding;
        Context ??= baseTemplate.Context;
        RedirectUri ??= baseTemplate.RedirectUri;
        Target ??= baseTemplate.Target;
        TargetContextMap ??= baseTemplate.TargetContextMap;
        TargetContextFromResponse ??= baseTemplate.TargetContextFromResponse;

        if (Query != baseTemplate.Query && baseTemplate.Query is not null)
        {
            foreach (var header in baseTemplate.Query)
            {
                Query!.TryAdd(header.Key, header.Value);
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
}
