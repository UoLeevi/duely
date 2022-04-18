using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Duely.Utilities;

public class StringTemplate
{
    private static readonly Regex rxPlaceholder = new(@"\$\{\{([\w_\$][\w\d_\$]*)(?=\}\})\}\}", RegexOptions.Compiled | RegexOptions.CultureInvariant);

    public static string Format(string template, IDictionary<string, JsonNode?> context)
    {
        var stringTemplate = new StringTemplate(template);
        return stringTemplate.Format(context);
    }

    public static string Format(string template, IDictionary<string, string> context)
    {
        var stringTemplate = new StringTemplate(template);
        return stringTemplate.Format(context);
    }

    private readonly Dictionary<string, int> placeholders = new();
    private readonly string format;

    public StringTemplate(string template)
    {
        // double opening curly bracets
        template = template.Replace("{", "{{");

        // double closing curly bracets
        template = template.Replace("}", "}}");

        // replace named placeholders with indexed placeholders 
        format = rxPlaceholder.Replace(template, ReplacePlaceholderNamesWithIndexes);
    }

    public string Format(IDictionary<string, JsonNode?> context)
    {
        var values = new string[placeholders.Count];

        foreach (var placeholder in placeholders)
        {
            values[placeholder.Value] = JsonPath.GetValueAsString(context, placeholder.Key);
        }

        return string.Format(format, values);
    }

    public string Format(IDictionary<string, string> context)
    {
        var values = new string[placeholders.Count];

        foreach (var placeholder in placeholders)
        {
            values[placeholder.Value] = context.TryGetValue(placeholder.Key, out var value) ? value : string.Empty;
        }

        return string.Format(format, values);
    }

    private string ReplacePlaceholderNamesWithIndexes(Match match)
    {
        string placeholder = match.Groups[1].Value;

        if (!placeholders.TryGetValue(placeholder, out int index))
        {
            index = placeholders.Count;
            placeholders.Add(placeholder, index);
        }

        return "{" + index + "}";
    }
}
