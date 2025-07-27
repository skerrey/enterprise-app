using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Attachment
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("url")]
        public string Url { get; set; } = "";

        [JsonPropertyName("size")]
        public long Size { get; set; }
    }
}