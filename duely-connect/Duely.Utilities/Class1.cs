using System.Text.RegularExpressions;

namespace Duely.Utilities
{
    public class StringTemplate
    {
        private static Regex rxPlaceholder = new(@"\$\{\{([\w_\$][\w\d_\$]*)(?=\}\})\}\}", RegexOptions.Compiled | RegexOptions.CultureInvariant);

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
}
