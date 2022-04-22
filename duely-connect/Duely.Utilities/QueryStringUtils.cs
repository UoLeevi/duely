using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using System.Text.Json.Nodes;

namespace Duely.Utilities;

public static class QueryStringUtils
{
    public static IDictionary<string, JsonNode> ParseQueryAsJson(string queryString)
    {
        var parsedQuery = QueryHelpers.ParseQuery(queryString);
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

        var dictionary = new JsonObject();

        foreach (var item in normalizedQuery)
        {

        }

        return dictionary;
    }
}
