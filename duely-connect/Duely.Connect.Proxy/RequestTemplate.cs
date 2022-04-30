using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Duely.Utilities;
using System.Diagnostics.CodeAnalysis;

namespace Duely.Connect.Proxy;

public class RequestTemplate
{
    private static ConcurrentDictionary<string, RequestTemplate> templates = new ConcurrentDictionary<string, RequestTemplate>();

    internal static bool TryGet(string id, [NotNullWhen(true)] out RequestTemplate? template)
    {
        return templates.TryGetValue(id, out template);
    }

    internal static bool TryAdd(RequestTemplateSpec spec, out RequestTemplate? template)
    {
        template = new RequestTemplate(spec);

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

    private RequestTemplate(RequestTemplateSpec spec)
    {
        Info = spec.Info;
        Id = spec.Id ?? CryptoHelpers.GenerateRandomKey();
        Url = spec.Url;
        Query = new Dictionary<string, string>(spec.Query ?? Enumerable.Empty<KeyValuePair<string, string>>());
        Method = spec.Method;
        Headers = new Dictionary<string, string[]>(spec.Headers ?? Enumerable.Empty<KeyValuePair<string, string[]>>());
        Body = spec.Body;
        BodyEncoding = spec.BodyEncoding;
        Context = new Dictionary<string, JsonNode?>(spec.Context ?? Enumerable.Empty<KeyValuePair<string, JsonNode?>>());
        RedirectUri = spec.RedirectUri;
        Target = spec.Target;
        TargetContextMap = new Dictionary<string, string>(spec.TargetContextMap ?? Enumerable.Empty<KeyValuePair<string, string>>());
        TargetContextFromResponse = new Dictionary<string, string>(spec.TargetContextFromResponse ?? Enumerable.Empty<KeyValuePair<string, string>>());
    }

    [JsonPropertyName("info")]
    public Uri? Info { get; private set; }

    [JsonPropertyName("id")]
    public string Id { get; private set; } = CryptoHelpers.GenerateRandomKey();

    [JsonPropertyName("url")]
    public string? Url { get; private set; }

    [JsonPropertyName("query")]
    public IDictionary<string, string> Query { get; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod? Method { get; private set; }

    [JsonPropertyName("headers")]
    public IDictionary<string, string[]> Headers { get; }

    [JsonPropertyName("body")]
    public string? Body { get; private set; }

    [JsonPropertyName("body_encoding")]
    [BindProperty(Name = "body_encoding")]
    public string? BodyEncoding { get; private set; }

    [JsonPropertyName("context")]
    [JsonConverter(typeof(RequestTemplateContextJsonConverter))]
    public IDictionary<string, JsonNode?> Context { get; }

    [JsonPropertyName("redirect_uri")]
    [BindProperty(Name = "redirect_uri")]
    public Uri? RedirectUri { get; private set; }

    [JsonPropertyName("target")]
    public string? Target { get; private set; }

    [JsonPropertyName("target_context_from_context")]
    [BindProperty(Name = "target_context_from_context")]
    public IDictionary<string, string> TargetContextMap { get; }

    [JsonPropertyName("target_context_from_response")]
    [BindProperty(Name = "target_context_from_response")]
    public IDictionary<string, string> TargetContextFromResponse { get; }

    private void UpdateFromBase(RequestTemplate baseTemplate)
    {
        Url ??= baseTemplate.Url;
        Method ??= baseTemplate.Method;
        Body ??= baseTemplate.Body;
        BodyEncoding ??= baseTemplate.BodyEncoding;
        RedirectUri ??= baseTemplate.RedirectUri;
        Target ??= baseTemplate.Target;

        if (baseTemplate.Query is not null)
        {
            foreach (var item in baseTemplate.Query)
            {
                Query!.TryAdd(item.Key, item.Value);
            }
        }

        if (baseTemplate.Headers is not null)
        {
            foreach (var header in baseTemplate.Headers)
            {
                Headers!.TryAdd(header.Key, header.Value);
            }
        }

        if (baseTemplate.Context is not null)
        {
            foreach (var item in baseTemplate.Context)
            {
                Context!.TryAdd(item.Key, item.Value);
            }
        }

        if (baseTemplate.TargetContextMap is not null)
        {
            foreach (var item in baseTemplate.TargetContextMap)
            {
                TargetContextMap!.TryAdd(item.Key, item.Value);
            }
        }

        if (baseTemplate.TargetContextFromResponse is not null)
        {
            foreach (var item in baseTemplate.TargetContextFromResponse)
            {
                TargetContextFromResponse!.TryAdd(item.Key, item.Value);
            }
        }
    }
}
