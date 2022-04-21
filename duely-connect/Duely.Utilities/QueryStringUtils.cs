using Microsoft.AspNetCore.WebUtilities;
using System.Text.Json.Nodes;

namespace Duely.Utilities;

public static class QueryStringUtils
{
    public static IDictionary<string, JsonNode> ParseQueryAsJson(string queryString)
    {
        var parsedQuery = QueryHelpers.ParseQuery(queryString);


        foreach (var item in parsedQuery)
        {
            var propertyNames = JsonPath.GetPropertyNamesFromPath(item.Key);
        }

        var dictionary = new Dictionary<string, JsonNode>();

        return dictionary;
    }
}
