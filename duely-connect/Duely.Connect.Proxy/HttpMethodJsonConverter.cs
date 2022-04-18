using System.Text.Json;
using System.Text.Json.Serialization;

namespace Duely.Connect.Proxy;

public class HttpMethodJsonConverter : JsonConverter<HttpMethod>
{
    public override HttpMethod? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return new HttpMethod(reader.GetString()!);
    }

    public override void Write(Utf8JsonWriter writer, HttpMethod value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Method);
    }
}
