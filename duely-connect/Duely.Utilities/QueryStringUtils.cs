using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using System.Text.Json.Nodes;

namespace Duely.Utilities;

public static class QueryStringUtils
{
    public static IDictionary<string, JsonNode?> ParseQueryAsJson(string queryString)
    {
        var parsedQuery = QueryHelpers.ParseQuery(queryString);
        return ParseQueryAsJson(parsedQuery);
    }

    public static IDictionary<string, JsonNode?> ParseQueryAsJson(QueryString queryString)
    {
        return ParseQueryAsJson(queryString.Value ?? string.Empty);
    }

    public static IDictionary<string, JsonNode?> ParseQueryAsJson(IQueryCollection parsedQuery)
    {
        return ParseQueryAsJson(new Dictionary<string, StringValues>(parsedQuery));
    }

    public static IDictionary<string, JsonNode?> ParseQueryAsJson(IDictionary<string, StringValues> parsedQuery)
    {
        var normalizedQuery = new Dictionary<string, StringValues>();

        foreach (var item in parsedQuery)
        {
            // normalize key
            var propertyNames = JsonPath.GetPropertyNamesFromPath(item.Key);
            var path = JsonPath.CreatePathFromPropertyNames(propertyNames);

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

        return jsonObjectRoot;
    }
}
