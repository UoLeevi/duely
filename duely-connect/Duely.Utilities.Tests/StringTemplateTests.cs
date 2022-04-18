using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Duely.Utilities.Tests
{
    [TestClass]
    public class StringTemplateTests
    {
        private IEnumerable<(string template, JsonObject context, string expected)> formatTestCases = new[]
        {
            (
                template: "${trivial}",
                context: JsonNode.Parse(JsonSerializer.Serialize(new {
                    trivial = "test"
                  }
                ))!.AsObject(),
                expected: "test"
            ),
            (
                template: "${key0}${key1}${key0}",
                context: JsonNode.Parse(JsonSerializer.Serialize(new {
                    key0 = "value0",
                    key1 = "value1",
                  }
                ))!.AsObject(),
                expected: "value0value1value0"
            ),
            (
                template: "somewords ${key0}asdf${key1}\nzzz${key0}123{}}@1${111",
                context: JsonNode.Parse(JsonSerializer.Serialize(new {
                    key0 = "value0",
                    key1 = "value1",
                  }
                ))!.AsObject(),
                expected: "somewords value0asdfvalue1\nzzzvalue0123{}}@1${111"
            )
        };

        [TestMethod]
        public void FormatDoesDoesPlaceholderSubstitutionCorrectly()
        {
            foreach ((string template, JsonObject context, string expected) in formatTestCases)
            {
                var result = StringTemplate.Format(template, context);
                Assert.IsTrue(result == expected);
            }
        }
    }
}
