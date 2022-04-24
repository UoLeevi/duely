using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using System.Text.Json.Nodes;

namespace Duely.Utilities;

public static class QueryStringUtils
{
    public static JsonObject ParseQueryAsJson(string queryString, params string[] rootPathPropertyNames)
    {
        var parsedQuery = QueryHelpers.ParseQuery(queryString);
        return ParseQueryAsJson(parsedQuery, rootPathPropertyNames);
    }

    public static JsonObject ParseQueryAsJson(QueryString queryString, params string[] rootPathPropertyNames)
    {
        return ParseQueryAsJson(queryString.Value ?? string.Empty, rootPathPropertyNames);
    }

    public static JsonObject ParseQueryAsJson(IQueryCollection parsedQuery, params string[] rootPathPropertyNames)
    {
        return ParseQueryAsJson(new Dictionary<string, StringValues>(parsedQuery), rootPathPropertyNames);
    }

    public static JsonObject ParseQueryAsJson(IDictionary<string, StringValues> parsedQuery, params string[] rootPathPropertyNames)
    {
        var normalizedQuery = new Dictionary<string, StringValues>();
        rootPathPropertyNames ??= Array.Empty<string>();
        var pathPrefix = rootPathPropertyNames.Length == 0 ? string.Empty : (JsonPath.CreatePathFromPropertyNames(rootPathPropertyNames) + '.');

        foreach (var item in parsedQuery)
        {
            // normalize key
            var propertyNames = JsonPath.GetPropertyNamesFromPath(item.Key);
            var path = JsonPath.CreatePathFromPropertyNames(propertyNames);
            if (!path.StartsWith(pathPrefix)) continue;

            if (!normalizedQuery.TryAdd(path, item.Value))
            {
                normalizedQuery[path] = StringValues.Concat(normalizedQuery[path], item.Value);
            }
        }

        var jsonObjectRoot = new JsonObject();

        foreach (var item in normalizedQuery)
        {
        nextProperty:
            var jsonObject = jsonObjectRoot;
            var propertyNames = JsonPath.GetPropertyNamesFromPath(item.Key);

            for (int i = 0; i < propertyNames.Length - 1; ++i)
            {
                string propertyName = propertyNames[i];

                if (!jsonObject.TryGetPropertyValue(propertyName, out var node)) node = null;

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

                // JsonObject node was expected. Let's skip this property.
                goto nextProperty;
            }

            JsonNode? value = item.Value.Count switch
            {
                0 => null,
                1 => JsonValue.Create(item.Value[0]),
                _ => new JsonArray(item.Value.Select(v => JsonValue.Create(v)).ToArray())
            };

            jsonObject[propertyNames[^1]] = value;
        }

        return JsonPath.GetNode(jsonObjectRoot, rootPathPropertyNames) is JsonObject result
            ? result
            : new JsonObject();
    }
}
