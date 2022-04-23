using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;

namespace Duely.Utilities;

public static class CryptoHelpers
{
    public static string GenerateRandomKey(int length = 24)
    {
        var bytes = RandomNumberGenerator.GetBytes(length);
        return Base64UrlTextEncoder.Encode(bytes);
    }
}
