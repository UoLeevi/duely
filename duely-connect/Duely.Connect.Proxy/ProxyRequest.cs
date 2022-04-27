using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Duely.Utilities;

namespace Duely.Connect.Proxy;

public class ProxyRequest
{
    public ProxyRequest(RequestTemplate template, IDictionary<string, JsonNode?> context)
    {
        // Merge provided context with template context
        Context = new Dictionary<string, JsonNode?>(context);
        template.Context.ToList().ForEach(x => Context.TryAdd(x.Key, x.Value));

        Id = CryptoHelpers.GenerateRandomKey();

        // Add special context variables
        Context["$request_id"] = Id;

        ArgumentNullException.ThrowIfNull(template.Url);
        var urlString = StringTemplate.Format(template.Url, Context);

        if (template.Query is not null)
        {
            urlString = QueryHelpers.AddQueryString(urlString, template.Query
                .Select(kvp => new KeyValuePair<string, string?>(
                    StringTemplate.Format(kvp.Key, Context),
                    StringTemplate.Format(kvp.Value, Context)))
                .Where(kvp => kvp.Key != string.Empty && kvp.Value != string.Empty));
        }

        Url = new Uri(urlString);

        Method = template.Method ?? HttpMethod.Get;
        Body = template.Body;

        Headers = template.Headers.ToDictionary(
            kvp => StringTemplate.Format(kvp.Key, Context),
            kvp => kvp.Value.Select(v => StringTemplate.Format(v, Context)).ToArray());

        Target = template.Target is null ? null : StringTemplate.Format(template.Target, Context);

        TargetContextFromResponse = template.TargetContextFromResponse.ToDictionary(
            kvp => StringTemplate.Format(kvp.Key, Context),
            kvp => StringTemplate.Format(kvp.Value, Context));

        TargetContextMap = template.TargetContextMap.ToDictionary(
            kvp => StringTemplate.Format(kvp.Key, Context),
            kvp => StringTemplate.Format(kvp.Value, Context));
    }

    [JsonPropertyName("id")]
    public string Id { get; private set; } = CryptoHelpers.GenerateRandomKey();

    [JsonPropertyName("url")]
    public Uri Url { get; set; }

    [JsonPropertyName("method")]
    [JsonConverter(typeof(HttpMethodJsonConverter))]
    public HttpMethod Method { get; private set; }

    [JsonPropertyName("headers")]
    public IDictionary<string, string[]> Headers { get; }

    [JsonPropertyName("body")]
    public string? Body { get; private set; }

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
    public IDictionary<string, string> TargetContextMap { get; private set; }

    [JsonPropertyName("target_context_from_response")]
    [BindProperty(Name = "target_context_from_response")]
    public IDictionary<string, string> TargetContextFromResponse { get; private set; }

    public HttpRequestMessage CreateRequestMessage(bool validate = true)
    {
        if (validate)
        {
            if (Url is null)
            {
                throw new InvalidOperationException("URL is required");
            }

            if (!Url.IsAbsoluteUri)
            {
                throw new InvalidOperationException("Absolute URL is required");
            }

            if (Url.Scheme != "http" && Url.Scheme != "https")
            {
                throw new InvalidOperationException("URL must use 'http' or 'https' scheme");
            }

            if (Url.IsLoopback)
            {
                throw new InvalidOperationException($"URL '{Url}' is not allowed.");
            }

            if (Url.HostNameType != UriHostNameType.Dns)
            {
                throw new InvalidOperationException($"URL '{Url}' is not allowed.");
            }
        }

        var requestMessage = new HttpRequestMessage(Method, Url);

        if (Body is not null)
        {
            requestMessage.Content = new StringContent(Body);
        }

        foreach (var header in Headers)
        {
            if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value) && requestMessage.Content != null)
            {
                requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }
        }

        return requestMessage;
    }
}
