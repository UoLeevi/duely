using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Duely.Utilities.Tests
{
    [TestClass]
    public class QueryStringUtilsTests
    {
        private Dictionary<string, (string query, string expectedJson)> parseTestCases = new()
        {
            ["test case 1"] = (
                query: "?test=value",
                expectedJson: JsonSerializer.Serialize(new
                {
                    test = "value"
                })
            ),
            ["test case 2"] = (
                query: "?headers[Content-Length]=3&url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%24%7Bquery%7D",
                expectedJson: JsonSerializer.Serialize(JsonNode.Parse(@"{
                    ""headers"": {
                        ""Content-Length"": ""3""
                    },
                    ""url"": ""https://www.google.com/search?q=${query}""
                }"))
            ),
            ["test case 3"] = (
                query: "?context._hidden_key=secret&context.deeply.nested.array=1&context.deeply[nested].array=2&context.deeply.nested['array']=3",
                expectedJson: JsonSerializer.Serialize(JsonNode.Parse(@"{
                    ""context"": {
                        ""_hidden_key"": ""secret"",
                        ""deeply"": {
                            ""nested"": {
                                ""array"": [""1"", ""2"", ""3""]
                            }
                        }
                    }
                }"))
            )
        };

        [TestMethod]
        [DataRow("test case 1")]
        [DataRow("test case 2")]
        [DataRow("test case 3")]
        public void DoesParseQueryStringAsJsonCorrectly(string testName)
        {
            (string query, string expectedJson) = parseTestCases[testName];

            var result = QueryStringUtils.ParseQueryAsJson(query);
            var resultJson = JsonSerializer.Serialize(result);
            Assert.IsTrue(resultJson == expectedJson);
        }
    }
}
