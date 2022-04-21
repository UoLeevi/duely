using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Text.Json;

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
            )
        };

        [TestMethod]
        [DataRow("test case 1")]
        public void DoesParseQueryStringAsJsonCorrectly(string testName)
        {
            (string query, string expectedJson) = parseTestCases[testName];

            var result = QueryStringUtils.ParseQueryAsJson(query);
            var resultJson = JsonSerializer.Serialize(result);
            Assert.IsTrue(resultJson == expectedJson);
        }
    }
}
