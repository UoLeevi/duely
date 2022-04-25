using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace Duely.Connect.Proxy;

public class RequestTemplateContextJsonConverter : JsonConverter<IDictionary<string, JsonNode?>>
{
    public override IDictionary<string, JsonNode?>? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return null;
    }

    public override void Write(Utf8JsonWriter writer, IDictionary<string, JsonNode?> value, JsonSerializerOptions options)
    {
        WriteObject(writer, value, options);

        static void WriteValue(Utf8JsonWriter writer, JsonNode? value, JsonSerializerOptions options)
        {
            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            if (value is JsonObject jsonObject)
            {
                WriteObject(writer, jsonObject, options);
                return;
            }

            if (value is JsonArray jsonArray)
            {
                WriteArray(writer, jsonArray, options);
                return;
            }

            writer.WriteRawValue(value.ToJsonString());
        }

        static void WriteProperty(Utf8JsonWriter writer, string propertyName, JsonNode? value, JsonSerializerOptions options)
        {
            writer.WritePropertyName(propertyName);

            // Values for properties with name that starts with an underscore should be masked
            if (propertyName.StartsWith("_"))
            {
                writer.WriteStringValue("***");
                return;
            }

            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            if (value is JsonObject jsonObject)
            {
                WriteObject(writer, jsonObject, options);
                return;
            }

            if (value is JsonArray jsonArray)
            {
                WriteArray(writer, jsonArray, options);
                return;
            }

            writer.WriteRawValue(value.ToJsonString());
        }

        static void WriteObject(Utf8JsonWriter writer, IDictionary<string, JsonNode?> value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();

            foreach (var item in value)
            {
                WriteProperty(writer, item.Key, item.Value, options);
            }

            writer.WriteEndObject();
        }

        static void WriteArray(Utf8JsonWriter writer, JsonArray value, JsonSerializerOptions options)
        {
            writer.WriteStartArray();

            foreach (var item in value)
            {
                WriteValue(writer, item, options);
            }

            writer.WriteEndArray();
        }
    }
}
