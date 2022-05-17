using Duely.Utilities;
using Json.Path;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Duely.Connect.SearchTools;

// TODO: When good API is decided, move implementation to database
public class QuotaExceededException : Exception
{
    public QuotaExceededException(string token) : base($"Quota exceeded for token '{token}'")
    {
    }
}

public static class QuotaManager
{
    private static readonly SemaphoreSlim semaphore = new SemaphoreSlim(1);

    private static readonly IDictionary<string, int> Quota = new ConcurrentDictionary<string, int>
    {
        ["x5VfPXaIyL-Q3oPYU12hUOioVj2SQKF0"] = 7500,
        ["o3ckGh2S6q5JgJ_Fx8tmi66NuwRc4Maj"] = 75
    };

    public static async Task<int> GetQuota(string token)
    {
        return Quota.TryGetValue(token, out var quota) ? quota : 0;
    }

    public static async Task<bool> TrySubstract(string token, int amount)
    {
        await semaphore.WaitAsync();

        try
        {
            var quota = await GetQuota(token);
            if (quota < amount) return false;
            Quota[token] = quota - amount;
            return true;
        }
        finally
        {
            semaphore.Release();
        }
    }

    public static async Task Add(string token, int amount)
    {
        await semaphore.WaitAsync();

        try
        {
            var quota = await GetQuota(token);
            Quota[token] = quota - amount;
        }
        finally
        {
            semaphore.Release();
        }
    }
}

[ApiController]
[Route("/quota")]
public class QuotaController : ControllerBase
{
    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
    };

    [HttpGet("{token}")]
    public async Task<IActionResult> Get(string token)
    {
        var quota = await QuotaManager.GetQuota(token);
        return new JsonResult(new
        {
            quota = quota
        }, jsonSerializerOptions);
    }
}

[ApiController]
[Route("/random")]
public class RandomController : ControllerBase
{
    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
    };

    [HttpGet()]
    public async Task<IActionResult> Get()
    {
        return new JsonResult(new
        {
            value = CryptoHelpers.GenerateRandomKey(),
        }, jsonSerializerOptions);
    }
}

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
    private readonly Func<Task<IDbConnection>> dbConnectionFactory;
    private readonly (string cx, string key) customsearchInfo;
    private readonly string saPassword;
    private readonly Json.Path.JsonPath linksJsonPath = Json.Path.JsonPath.Parse("$.items[*].link");

    public SearchToolsController(IConfiguration configuration, IHttpClientFactory httpClientFactory, Func<Task<IDbConnection>> dbConnectionFactory)
    {
        string? cx = configuration.GetValue<string?>("google-customsearch:cx") ?? configuration.GetValue<string?>("DUELY_GOOGLE_CUSTOMSEARCH_CX");
        string? key = configuration.GetValue<string?>("google-customsearch:key") ?? configuration.GetValue<string?>("DUELY_GOOGLE_CUSTOMSEARCH_KEY");

        ArgumentNullException.ThrowIfNull(cx, "google-customsearch:cx");
        ArgumentNullException.ThrowIfNull(key, "google-customsearch:key");

        customsearchInfo = (cx, key);

        var saPassword = configuration.GetValue<string?>("duely-serviceaccount:password") ?? configuration.GetValue<string?>("DUELY_SERVICE_ACCOUNT_PASSWORD");

        ArgumentNullException.ThrowIfNull(saPassword, "duely-serviceaccount:password");
        this.saPassword = saPassword;

        this.httpClientFactory = httpClientFactory;
        this.dbConnectionFactory = dbConnectionFactory;
    }

    // see: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
    [HttpGet("search")]
    public async Task<IActionResult> GetSearch([FromQuery] string token, [FromQuery] GoogleCustomSearchParameters cseParameters)
    {
        try
        {
            var results = await Search(token, cseParameters);
            return new JsonResult(new
            {
                results = results,
                balance = await QuotaManager.GetQuota(token)
            }, jsonSerializerOptions);
        }
        catch (QuotaExceededException exception)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = exception.Message
            });
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = exception.Message
            });
        }
    }

    [HttpGet("cluster")]
    public async Task<IActionResult> GetCluster([FromQuery] string token, [FromQuery] string[] keywords)
    {
        try
        {
            // Number of common results required for pairing keywords
            const int threshold = 4;

            // First page search results
            var results = await Task.WhenAll(keywords.Select(kw => Search(token, new(kw))).ToArray());

            // Calculate number of matches between keyword pairs
            /*
                    kw0 kw1 kw2 kw3 kw4
              kw0 [[  0,  4,  1, 10,  2],
              kw1  [  0,  0,  2,  5,  1],
              kw2  [  0,  0,  0,  1,  0],
              kw3  [  0,  0,  0,  0,  1],
              kw4  [  0,  0,  0,  0,  0]]
             */

            var matches = new int[keywords.Length, keywords.Length];

            for (int i = 0; i < keywords.Length - 1; ++i)
            {
                var r_i = results[i]!;

                for (int j = i + 1; j < keywords.Length; ++j)
                {
                    var r_j = results[j]!;

                    for (int k = 0; k < r_i.Length; ++k)
                    {
                        string? url_i = r_i[k];

                        for (int l = 0; l < r_j.Length; ++l)
                        {
                            string? url_j = r_j[l];
                            if (url_i == url_j) ++matches[i, j];
                        }
                    }
                }
            }

            // Convert match counts to true/false matrix
            /*
                    kw0 kw1 kw2 kw3 kw4
              kw0 [[  x,  x,   ,  x,   ],
              kw1  [  x,  x,   ,  x,   ],
              kw2  [   ,   ,  x,   ,   ],
              kw3  [  x,  x,   ,  x,   ],
              kw4  [   ,   ,   ,   ,  x]]
             */

            var mask = new bool[keywords.Length, keywords.Length];

            for (int i = 0; i < keywords.Length; ++i)
            {
                mask[i, i] = true;

                for (int j = i + 1; j < keywords.Length; ++j)
                {
                    mask[j, i] = mask[i, j] = matches[i, j] >= threshold;
                }
            }

            // Sort keywords by number of pairs

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

            // Sort the mask matrix rows
            /*
                    kw0 kw1 kw2 kw3 kw4
              kw0 [[  x,  x,   ,  x,   ],
              kw1  [  x,  x,   ,  x,   ],
              kw3  [  x,  x,   ,  x,   ],
              kw2  [   ,   ,  x,   ,   ],
              kw4  [   ,   ,   ,   ,  x]]
             */

            var maskSorted = new bool[keywords.Length, keywords.Length];

            for (int i = 0; i < keywords.Length; ++i)
            {
                var idx = indexes[i].i;
                for (int j = 0; j < keywords.Length; ++j)
                {
                    maskSorted[i, j] = mask[idx, j];
                }
            }

            // Merge mask matrix rows with overlap
            /*
                    kw0 kw1 kw2 kw3 kw4
                  [[  x,  x,   ,  x,   ],
                   [   ,   ,  x,   ,   ],
                   [   ,   ,   ,   ,  x]]
             */

            List<bool[]> clusteredMask = new();
            for (int i = 0; i < keywords.Length; ++i)
            {
                foreach (var merged in clusteredMask)
                {
                    for (int j = 0; j < keywords.Length; ++j)
                    {
                        if (maskSorted[i, j] && merged[j])
                        {
                            for (int k = 0; k < keywords.Length; ++k)
                            {
                                merged[k] |= maskSorted[i, k];
                            }

                            goto nextKeyword;
                        }
                    }
                }

                var n = new bool[keywords.Length];
                clusteredMask.Add(n);

                for (int k = 0; k < keywords.Length; ++k)
                {
                    n[k] = maskSorted[i, k];
                }
            nextKeyword:;
            }

            // Create clusters and group unclusterd keywords
            /*
                    kw0 kw1 kw2 kw3 kw4
               c1  [[  x,  x,   ,  x,   ],
              (uc) [   ,   ,  x,   ,  x]]
             */

            Dictionary<string, List<string>> clusters = new();
            var noCluster = new List<string>();

            foreach (var merged in clusteredMask)
            {
                string? kw = null;
                int count = 0;
                for (int i = 0; i < keywords.Length && count < 2; ++i)
                {
                    if (merged[i])
                    {
                        ++count;
                        kw = keywords[i];
                    }
                }

                if (count == 1)
                {
                    noCluster.Add(kw!);
                    continue;
                }

                var cluster = new List<string>();
                var name = indexes.First(kw => merged[kw.i]).kw;
                clusters.Add(name, cluster);

                for (int i = 0; i < keywords.Length; ++i)
                {
                    if (merged[i])
                    {
                        cluster.Add(keywords[i]);
                    }
                }
            }

            if (noCluster.Count > 0) clusters.Add("(no cluster)", noCluster);

            return new JsonResult(new
            {
                results = keywords.Select((kw, i) => (kw, i)).ToDictionary(x => x.kw, x => results[x.i]),
                clusters = clusters.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToArray()),
                balance = await QuotaManager.GetQuota(token)
            }, jsonSerializerOptions);
        }
        catch (QuotaExceededException exception)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = exception.Message
            });
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = exception.Message
            });
        }
    }

    private static ConcurrentDictionary<GoogleCustomSearchParameters, (string[] results, HashSet<string> tokens)> searchResultsCache = new();

    private async Task<string[]?> Search(string token, GoogleCustomSearchParameters cseParameters)
    {
        if (searchResultsCache.TryGetValue(cseParameters, out var entry))
        {
            if (!entry.tokens.Contains(token))
            {
                if (!await QuotaManager.TrySubstract(token, 75))
                {
                    throw new QuotaExceededException(token);
                }

                lock (entry.tokens)
                {
                    entry.tokens.Add(token);
                }
            }

            return entry.results;
        }

        if (!await QuotaManager.TrySubstract(token, 75))
        {
            throw new QuotaExceededException(token);
        }

        var url = (cseParameters with
        {
            cx = customsearchInfo.cx,
            key = customsearchInfo.key,
            fields = "items.link"
        }).ToUrl();

        using var client = httpClientFactory.CreateClient();
        var responseMessage = await client.GetAsync(url);
        using Stream responseStream = await responseMessage.Content.ReadAsStreamAsync();
        var jsonDocument = await JsonDocument.ParseAsync(responseStream);

        var results = linksJsonPath.Evaluate(jsonDocument.RootElement).Matches?.Select(m => m.Value.GetString()!).ToArray();

        if (results?.Any() is true)
        {
            searchResultsCache.TryAdd(cseParameters, (results, new() { token }));
        }

        return results;
    }
}

// see: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list#query-parameters
// see: https://cloud.google.com/apis/docs/system-parameters
public record GoogleCustomSearchParameters
{
    public GoogleCustomSearchParameters([Required] string q)
    {
        this.q = q;
    }

    public string? c2coff { get; init; }
    public string? cr { get; init; }
    public string? cx { get; init; }
    public string? dateRestrict { get; init; }
    public string? exactTerms { get; init; }
    public string? excludeTerms { get; init; }
    public string? fileType { get; init; }
    public string? filter { get; init; }
    public string? gl { get; init; }
    public string? highRange { get; init; }
    public string? hl { get; init; }
    public string? hq { get; init; }
    public string? imgColorType { get; init; }
    public string? imgDominantColor { get; init; }
    public string? imgSize { get; init; }
    public string? imgType { get; init; }
    public string? linkSite { get; init; }
    public string? lowRange { get; init; }
    public string? lr { get; init; }
    public int? num { get; init; }
    public string? orTerms { get; init; }
    public string q { get; init; }
    public string? relatedSite { get; init; }
    public string? rights { get; init; }
    public string? safe { get; init; }
    public string? searchType { get; init; }
    public string? siteSearch { get; init; }
    public string? siteSearchFilter { get; init; }
    public string? sort { get; init; }
    public int? start { get; init; }
    public string? upload_protocol { get; init; }
    public string? uploadType { get; init; }
    public string? quotaUser { get; init; }
    public string? callback { get; init; }
    public string? xgafv { get; init; }
    public string? prettyPrint { get; init; }
    public string? alt { get; init; }
    public string? access_token { get; init; }
    public string? fields { get; init; }
    public string? key { get; init; }

    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
    };

    public override string ToString()
    {
        return JsonSerializer.Serialize(this, jsonSerializerOptions);
    }

    public Uri ToUrl()
    {
        Dictionary<string, string?> parameters = new();
        if (c2coff is not null) parameters.Add("c2coff", c2coff);
        if (cr is not null) parameters.Add("cr", cr);
        if (cx is not null) parameters.Add("cx", cx);
        if (dateRestrict is not null) parameters.Add("dateRestrict", dateRestrict);
        if (exactTerms is not null) parameters.Add("exactTerms", exactTerms);
        if (excludeTerms is not null) parameters.Add("excludeTerms", excludeTerms);
        if (fileType is not null) parameters.Add("fileType", fileType);
        if (filter is not null) parameters.Add("filter", filter);
        if (gl is not null) parameters.Add("gl", gl);
        if (highRange is not null) parameters.Add("highRange", highRange);
        if (hl is not null) parameters.Add("hl", hl);
        if (hq is not null) parameters.Add("hq", hq);
        if (imgColorType is not null) parameters.Add("imgColorType", imgColorType);
        if (imgDominantColor is not null) parameters.Add("imgDominantColor", imgDominantColor);
        if (imgSize is not null) parameters.Add("imgSize", imgSize);
        if (imgType is not null) parameters.Add("imgType", imgType);
        if (linkSite is not null) parameters.Add("linkSite", linkSite);
        if (lowRange is not null) parameters.Add("lowRange", lowRange);
        if (lr is not null) parameters.Add("lr", lr);
        if (num is not null) parameters.Add("num", num.ToString());
        if (orTerms is not null) parameters.Add("orTerms", orTerms);
        if (q is not null) parameters.Add("q", q);
        if (relatedSite is not null) parameters.Add("relatedSite", relatedSite);
        if (rights is not null) parameters.Add("rights", rights);
        if (safe is not null) parameters.Add("safe", safe);
        if (searchType is not null) parameters.Add("searchType", searchType);
        if (siteSearch is not null) parameters.Add("siteSearch", siteSearch);
        if (siteSearchFilter is not null) parameters.Add("siteSearchFilter", siteSearchFilter);
        if (sort is not null) parameters.Add("sort", sort);
        if (start is not null) parameters.Add("start", start.ToString());
        if (upload_protocol is not null) parameters.Add("upload_protocol", upload_protocol);
        if (uploadType is not null) parameters.Add("uploadType", uploadType);
        if (quotaUser is not null) parameters.Add("quotaUser", quotaUser);
        if (callback is not null) parameters.Add("callback", callback);
        if (xgafv is not null) parameters.Add("xgafv", xgafv);
        if (prettyPrint is not null) parameters.Add("prettyPrint", prettyPrint);
        if (alt is not null) parameters.Add("alt", alt);
        if (access_token is not null) parameters.Add("access_token", access_token);
        if (fields is not null) parameters.Add("fields", fields);
        if (key is not null) parameters.Add("key", key);

        return new Uri(QueryHelpers.AddQueryString(
            "https://customsearch.googleapis.com/customsearch/v1",
            parameters));
    }
}
