using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Duely.Utilities.Tests
{
    [TestClass]
    public class StringTemplateTests
    {
        private Dictionary<string, (string template, JsonObject context, string expected)> formatTestCases = new()
        {
            ["test case 1"] = (
                template: "${trivial}",
                context: JsonNode.Parse(JsonSerializer.Serialize(new
                {
                    trivial = "test"
                }
                ))!.AsObject(),
                expected: "test"
            ),
            ["test case 2"] = (
                template: "${key0}${key1}${key0}",
                context: JsonNode.Parse(JsonSerializer.Serialize(new
                {
                    key0 = "value0",
                    key1 = "value1",
                }
                ))!.AsObject(),
                expected: "value0value1value0"
            ),
            ["test case 3"] = (
                template: "somewords ${key0}asdf${key1}\nzzz${key0}123{}}@1${111",
                context: JsonNode.Parse(JsonSerializer.Serialize(new
                {
                    key0 = "value0",
                    key1 = "value1",
                }
                ))!.AsObject(),
                expected: "somewords value0asdfvalue1\nzzzvalue0123{}}@1${111"
            )
        };

        [DataTestMethod]
        [DataRow("test case 1")]
        [DataRow("test case 2")]
        [DataRow("test case 3")]
        public void FormatDoesDoesPlaceholderSubstitutionCorrectly(string testName)
        {
            (string template, JsonObject context, string expected) = formatTestCases[testName];

            var result = StringTemplate.Format(template, context);
            Assert.IsTrue(result == expected);

        }
    }
}
