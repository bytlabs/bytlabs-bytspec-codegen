public class JsonObjectBuilder
{
    private JsonObject targetJson = new JsonObject();

    /// <summary>
    /// Merges two JsonObjects. Properties from sourceJson override those in targetJson.
    /// </summary>
    public JsonObjectBuilder Merge<T>(T source)
    {
        var sourceJson = JsonNode.Parse(JsonSerializer.Serialize(source)).AsObject();
        targetJson = MergeJson(targetJson, sourceJson);
        return this;
    }

    /// <summary>
    /// Merges two JsonObjects. Properties from sourceJson override those in targetJson.
    /// </summary>
    private static JsonObject MergeJson(JsonObject targetJson, JsonObject sourceJson)
    {
        foreach (var property in sourceJson)
        {
            // If the property is an object, merge recursively
            if (property.Value is JsonObject sourceChildObject &&
                targetJson[property.Key] is JsonObject targetChildObject)
            {
                targetJson[property.Key] = MergeJson(targetChildObject, sourceChildObject);
            }
            else
            {
                // Override or add property
                targetJson[property.Key] = property.Value;
            }
        }

        return targetJson;
    }

    /// <summary>
    /// Omits the specified keys from a JsonObject.
    /// </summary>
    public JsonObjectBuilder Omit(IEnumerable<string> keysToOmit)
    {
        foreach (var key in keysToOmit)
        {
            if (targetJson.ContainsKey(key))
            {
                targetJson.Remove(key);
            }
        }

        return this;
    }

    public T Build<T>() {
        var data = targetJson.Deserialize<T>();
        targetJson = new JsonObject();
        return data;
    }
}
