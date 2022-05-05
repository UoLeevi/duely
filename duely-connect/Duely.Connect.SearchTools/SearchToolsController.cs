using Json.Path;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Duely.Connect.SearchTools;

[ApiController]
[Route("/search-tools")]
public class SearchToolsController : ControllerBase
{
    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
    };

    private readonly IHttpClientFactory httpClientFactory;
    private readonly (string cx, string key) customsearchInfo;
    private readonly JsonPath linksJsonPath = JsonPath.Parse("$.items[*].link");

    public SearchToolsController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        string? cx = configuration.GetValue<string?>("google-customsearch:cx") ?? configuration.GetValue<string?>("DUELY_GOOGLE_CUSTOMSEARCH_CX");
        string? key = configuration.GetValue<string?>("google-customsearch:key") ?? configuration.GetValue<string?>("DUELY_GOOGLE_CUSTOMSEARCH_KEY");

        ArgumentNullException.ThrowIfNull(cx, "google-customsearch:cx");
        ArgumentNullException.ThrowIfNull(key, "google-customsearch:key");

        customsearchInfo = (cx, key);

        this.httpClientFactory = httpClientFactory;
    }

    // see: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] GoogleCustomSearchParameters cseParameters)
    {
        var url = cseParameters.CreateUrl(new GoogleCustomSearchParameters
        {
            cx = customsearchInfo.cx,
            key = customsearchInfo.key,
            fields = "items.link"
        });

        using var client = httpClientFactory.CreateClient();
        var responseMessage = await client.GetAsync(url);
        using Stream responseStream = await responseMessage.Content.ReadAsStreamAsync();
        var jsonDocument = await JsonDocument.ParseAsync(responseStream);

        var json = linksJsonPath.Evaluate(jsonDocument.RootElement).Matches?.Select(m => m.Value).ToArray();

        return new JsonResult(json, jsonSerializerOptions);
    }

    [HttpGet("cluster")]
    public async Task<IActionResult> Cluster([FromQuery] string[] keywords)
    {
        const int threshold = 4;
        var results = await Task.WhenAll(keywords.Select(kw => Search(kw)).ToArray());

        var matches = new int[keywords.Length, keywords.Length];

        for (int i = 0; i < keywords.Length; ++i)
        {
            var r_i = results[i]!;

            for (int j = i; j < keywords.Length; ++j)
            {
                if (i == j) continue;

                var r_j = results[j]!;

                for (int k = 0; k < r_i.Length; ++k)
                {
                    string? url_i = r_i[k].GetString();

                    for (int l = 0; l < r_j.Length; ++l)
                    {
                        string? url_j = r_j[l].GetString();
                        if (url_i == url_j) ++matches[i, j];
                    }
                }
            }
        }

        var mask = new bool[keywords.Length, keywords.Length];

        for (int i = 0; i < keywords.Length; ++i)
        {
            for (int j = i; j < keywords.Length; ++j)
            {
                mask[j, i] = mask[i, j] = matches[i, j] >= threshold;
            }
        }

        var indexes = keywords
            .Select((kw, i) => (kw, i))
            .OrderByDescending(x =>
            {
                int count = 0;
                for (int i = 0; i < keywords.Length; ++i)
                {
                    if (mask[x.i, i]) ++count;
                }

                return count;
            })
            .ToList();

        // TODO:

        throw new NotImplementedException();

        return new JsonResult(null, jsonSerializerOptions);
    }

    private async Task<JsonElement[]?> Search(string q)
    {
        var cseParameters = new GoogleCustomSearchParameters { q = q };

        var url = cseParameters.CreateUrl(new GoogleCustomSearchParameters
        {
            cx = customsearchInfo.cx,
            key = customsearchInfo.key,
            fields = "items.link"
        });

        using var client = httpClientFactory.CreateClient();
        var responseMessage = await client.GetAsync(url);
        using Stream responseStream = await responseMessage.Content.ReadAsStreamAsync();
        var jsonDocument = await JsonDocument.ParseAsync(responseStream);

        return linksJsonPath.Evaluate(jsonDocument.RootElement).Matches?.Select(m => m.Value).ToArray();
    }
}

// see: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list#query-parameters
// see: https://cloud.google.com/apis/docs/system-parameters
public class GoogleCustomSearchParameters
{
    public string? c2coff { get; set; }
    public string? cr { get; set; }
    public string? cx { get; set; }
    public string? dateRestrict { get; set; }
    public string? exactTerms { get; set; }
    public string? excludeTerms { get; set; }
    public string? fileType { get; set; }
    public string? filter { get; set; }
    public string? gl { get; set; }
    public string? highRange { get; set; }
    public string? hl { get; set; }
    public string? hq { get; set; }
    public string? imgColorType { get; set; }
    public string? imgDominantColor { get; set; }
    public string? imgSize { get; set; }
    public string? imgType { get; set; }
    public string? linkSite { get; set; }
    public string? lowRange { get; set; }
    public string? lr { get; set; }
    public int? num { get; set; }
    public string? orTerms { get; set; }
    public string? q { get; set; }
    public string? relatedSite { get; set; }
    public string? rights { get; set; }
    public string? safe { get; set; }
    public string? searchType { get; set; }
    public string? siteSearch { get; set; }
    public string? siteSearchFilter { get; set; }
    public string? sort { get; set; }
    public int? start { get; set; }
    public string? upload_protocol { get; set; }
    public string? uploadType { get; set; }
    public string? quotaUser { get; set; }
    public string? callback { get; set; }
    public string? xgafv { get; set; }
    public string? prettyPrint { get; set; }
    public string? alt { get; set; }
    public string? access_token { get; set; }
    public string? fields { get; set; }
    public string? key { get; set; }

    public Uri CreateUrl(GoogleCustomSearchParameters fixedParameters)
    {
        Dictionary<string, string?> parameters = new();

        if (fixedParameters.c2coff is not null) parameters.Add("c2coff", fixedParameters.c2coff);
        else if (c2coff is not null) parameters.Add("c2coff", c2coff);

        if (fixedParameters.cr is not null) parameters.Add("cr", fixedParameters.cr);
        else if (cr is not null) parameters.Add("cr", cr);

        if (fixedParameters.cx is not null) parameters.Add("cx", fixedParameters.cx);
        else if (cx is not null) parameters.Add("cx", cx);

        if (fixedParameters.dateRestrict is not null) parameters.Add("dateRestrict", fixedParameters.dateRestrict);
        else if (dateRestrict is not null) parameters.Add("dateRestrict", dateRestrict);

        if (fixedParameters.exactTerms is not null) parameters.Add("exactTerms", fixedParameters.exactTerms);
        else if (exactTerms is not null) parameters.Add("exactTerms", exactTerms);

        if (fixedParameters.excludeTerms is not null) parameters.Add("excludeTerms", fixedParameters.excludeTerms);
        else if (excludeTerms is not null) parameters.Add("excludeTerms", excludeTerms);

        if (fixedParameters.fileType is not null) parameters.Add("fileType", fixedParameters.fileType);
        else if (fileType is not null) parameters.Add("fileType", fileType);

        if (fixedParameters.filter is not null) parameters.Add("filter", fixedParameters.filter);
        else if (filter is not null) parameters.Add("filter", filter);

        if (fixedParameters.gl is not null) parameters.Add("gl", fixedParameters.gl);
        else if (gl is not null) parameters.Add("gl", gl);

        if (fixedParameters.highRange is not null) parameters.Add("highRange", fixedParameters.highRange);
        else if (highRange is not null) parameters.Add("highRange", highRange);

        if (fixedParameters.hl is not null) parameters.Add("hl", fixedParameters.hl);
        else if (hl is not null) parameters.Add("hl", hl);

        if (fixedParameters.hq is not null) parameters.Add("hq", fixedParameters.hq);
        else if (hq is not null) parameters.Add("hq", hq);

        if (fixedParameters.imgColorType is not null) parameters.Add("imgColorType", fixedParameters.imgColorType);
        else if (imgColorType is not null) parameters.Add("imgColorType", imgColorType);

        if (fixedParameters.imgDominantColor is not null) parameters.Add("imgDominantColor", fixedParameters.imgDominantColor);
        else if (imgDominantColor is not null) parameters.Add("imgDominantColor", imgDominantColor);

        if (fixedParameters.imgSize is not null) parameters.Add("imgSize", fixedParameters.imgSize);
        else if (imgSize is not null) parameters.Add("imgSize", imgSize);

        if (fixedParameters.imgType is not null) parameters.Add("imgType", fixedParameters.imgType);
        else if (imgType is not null) parameters.Add("imgType", imgType);

        if (fixedParameters.linkSite is not null) parameters.Add("linkSite", fixedParameters.linkSite);
        else if (linkSite is not null) parameters.Add("linkSite", linkSite);

        if (fixedParameters.lowRange is not null) parameters.Add("lowRange", fixedParameters.lowRange);
        else if (lowRange is not null) parameters.Add("lowRange", lowRange);

        if (fixedParameters.lr is not null) parameters.Add("lr", fixedParameters.lr);
        else if (lr is not null) parameters.Add("lr", lr);

        if (fixedParameters.num is not null) parameters.Add("num", fixedParameters.num.ToString());
        else if (num is not null) parameters.Add("num", num.ToString());

        if (fixedParameters.orTerms is not null) parameters.Add("orTerms", fixedParameters.orTerms);
        else if (orTerms is not null) parameters.Add("orTerms", orTerms);

        if (fixedParameters.q is not null) parameters.Add("q", fixedParameters.q);
        else if (q is not null) parameters.Add("q", q);

        if (fixedParameters.relatedSite is not null) parameters.Add("relatedSite", fixedParameters.relatedSite);
        else if (relatedSite is not null) parameters.Add("relatedSite", relatedSite);

        if (fixedParameters.rights is not null) parameters.Add("rights", fixedParameters.rights);
        else if (rights is not null) parameters.Add("rights", rights);

        if (fixedParameters.safe is not null) parameters.Add("safe", fixedParameters.safe);
        else if (safe is not null) parameters.Add("safe", safe);

        if (fixedParameters.searchType is not null) parameters.Add("searchType", fixedParameters.searchType);
        else if (searchType is not null) parameters.Add("searchType", searchType);

        if (fixedParameters.siteSearch is not null) parameters.Add("siteSearch", fixedParameters.siteSearch);
        else if (siteSearch is not null) parameters.Add("siteSearch", siteSearch);

        if (fixedParameters.siteSearchFilter is not null) parameters.Add("siteSearchFilter", fixedParameters.siteSearchFilter);
        else if (siteSearchFilter is not null) parameters.Add("siteSearchFilter", siteSearchFilter);

        if (fixedParameters.sort is not null) parameters.Add("sort", fixedParameters.sort);
        else if (sort is not null) parameters.Add("sort", sort);

        if (fixedParameters.start is not null) parameters.Add("start", fixedParameters.start.ToString());
        else if (start is not null) parameters.Add("start", start.ToString());

        if (fixedParameters.upload_protocol is not null) parameters.Add("upload_protocol", fixedParameters.upload_protocol);
        else if (upload_protocol is not null) parameters.Add("upload_protocol", upload_protocol);

        if (fixedParameters.uploadType is not null) parameters.Add("uploadType", fixedParameters.uploadType);
        else if (uploadType is not null) parameters.Add("uploadType", uploadType);

        if (fixedParameters.quotaUser is not null) parameters.Add("quotaUser", fixedParameters.quotaUser);
        else if (quotaUser is not null) parameters.Add("quotaUser", quotaUser);

        if (fixedParameters.callback is not null) parameters.Add("callback", fixedParameters.callback);
        else if (callback is not null) parameters.Add("callback", callback);

        if (fixedParameters.xgafv is not null) parameters.Add("xgafv", fixedParameters.xgafv);
        else if (xgafv is not null) parameters.Add("xgafv", xgafv);

        if (fixedParameters.prettyPrint is not null) parameters.Add("prettyPrint", fixedParameters.prettyPrint);
        else if (prettyPrint is not null) parameters.Add("prettyPrint", prettyPrint);

        if (fixedParameters.alt is not null) parameters.Add("alt", fixedParameters.alt);
        else if (alt is not null) parameters.Add("alt", alt);

        if (fixedParameters.access_token is not null) parameters.Add("access_token", fixedParameters.access_token);
        else if (access_token is not null) parameters.Add("access_token", access_token);

        if (fixedParameters.fields is not null) parameters.Add("fields", fixedParameters.fields);
        else if (fields is not null) parameters.Add("fields", fields);

        if (fixedParameters.key is not null) parameters.Add("key", fixedParameters.key);
        else if (key is not null) parameters.Add("key", key);

        return new Uri(QueryHelpers.AddQueryString(
            "https://customsearch.googleapis.com/customsearch/v1",
            parameters));
    }
};
