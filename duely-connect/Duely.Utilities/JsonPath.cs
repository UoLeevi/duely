using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Duely.Utilities;

// Currently very very simple implementation only used for the most basic operations
public static class JsonPath
{
    public static JsonNode? GetNode(JsonNode? jsonNode, string[] pathAsPropertyNames)
    {
        if (pathAsPropertyNames.Length == 0) return jsonNode;
        var pathNodes = GetPathJsonNodes(jsonNode, pathAsPropertyNames).ToArray();
        if (pathNodes.Length == pathAsPropertyNames.Length) return pathNodes[^1];
        return null;

        static IEnumerable<JsonNode?> GetPathJsonNodes(JsonNode? jsonNode, string[] pathAsPropertyNames)
        {
            if (jsonNode is null) yield break;

            foreach (var propertyName in pathAsPropertyNames)
            {
                if (jsonNode is JsonArray jsonArray)
                {
                    if (!int.TryParse(propertyName, out int index)) yield break;
                    if (index < 0) yield break;
                    if (index >= jsonArray.Count) yield break;
                    jsonNode = jsonArray[index];
                    yield return jsonNode;
                }

                if (jsonNode is JsonObject jsonObject)
                {
                    if (!jsonObject.TryGetPropertyValue(propertyName, out jsonNode)) yield break;
                    yield return jsonNode;
                }
            }
        }
    }

    public static string GetValueAsString(IDictionary<string, JsonNode?> jsonObject, string path)
    {
        string[] propertyNames = GetPropertyNamesFromPath(path);

        if (propertyNames.Length == 0) return string.Empty;

        if (!jsonObject.TryGetValue(propertyNames[0], out JsonNode jsonNode)) return string.Empty;

        return GetValueAsString(jsonNode, propertyNames[1..]);
    }

    public static string GetValueAsString(JsonNode? jsonNode, string path)
    {
        return GetValueAsString(jsonNode, GetPropertyNamesFromPath(path));
    }

    public static string GetValueAsString(JsonNode? jsonNode, string[] pathAsPropertyNames)
    {
        return GetNode(jsonNode, pathAsPropertyNames) is JsonValue value
            ? value.ToString()
            : string.Empty;
    }

    private static readonly char[] simpleJsonPathSeparators = new[] { '.', '[', ']', '"', '\'' };
    private static readonly Regex rxRootSelectorPrefix = new(@"^\$[\.\[]");

    public static string[] GetPropertyNamesFromPath(string path)
    {
        // For null or empty string, return empty array
        if (string.IsNullOrEmpty(path)) return Array.Empty<string>();

        // Let's remove the initial root object selector
        path = rxRootSelectorPrefix.Replace(path, "");

        // Let's keep it simple and assume that property names do not contain these separator characters
        // Also let's be very lax about "incorrectly" formatted path expressions
        return path.Split(simpleJsonPathSeparators, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    public static string CreatePathFromPropertyNames(string[] propertyNames)
    {
        return string.Join('.', propertyNames);
    }
}
