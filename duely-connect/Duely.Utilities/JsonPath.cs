using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Duely.Utilities;

// Currently very very simple implementation only used for the most basic operations
public class JsonPath
{
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
        foreach (var propertyName in pathAsPropertyNames)
        {
            if (jsonNode is null) return string.Empty;

            if (jsonNode is JsonValue) return string.Empty;

            if (jsonNode is JsonArray jsonArray)
            {
                if (!int.TryParse(propertyName, out int index)) return string.Empty;
                if (index < 0) return string.Empty;
                if (index >= jsonArray.Count) return string.Empty;
                jsonNode = jsonArray[index];
                continue;
            }

            if (jsonNode is JsonObject jsonObject)
            {
                jsonNode = jsonObject[propertyName];
                if (jsonNode is null) return string.Empty;
                continue;
            }

            throw new();
        }

        if (jsonNode is JsonValue value) return value.ToString();

        return string.Empty;
    }

    private static readonly char[] simpleJsonPathSeparators = new[] { '.', '[', ']', '"', '\'' };
    private static readonly Regex rxRootSelectorPrefix = new(@"^\$[\.\[]");

    private static string[] GetPropertyNamesFromPath(string path)
    {
        // For null or empty string, return empty array
        if (string.IsNullOrEmpty(path)) return Array.Empty<string>();

        // Let's remove the initial root object selector
        path = rxRootSelectorPrefix.Replace(path, "");

        // Let's keep it simple and assume that property names do not contain these separator characters
        // Also let's be very lax about "incorrectly" formatted path expressions
        return path.Split(simpleJsonPathSeparators, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}
