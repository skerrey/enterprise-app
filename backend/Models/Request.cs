using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Request
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("requestorName")]
        public string RequestorName { get; set; }

        [JsonPropertyName("requestorEmail")]
        public string RequestorEmail { get; set; }

        [JsonPropertyName("department")]
        public string Department { get; set; }

        [JsonPropertyName("employeeID")]
        public string EmployeeID { get; set; }

        [JsonPropertyName("onBehalfOf")]
        public string? OnBehalfOf { get; set; }

        [JsonPropertyName("requestTitle")]
        public string RequestTitle { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("requestedDate")]
        public string RequestedDate { get; set; }

        [JsonPropertyName("dueDate")]
        public string? DueDate { get; set; }

        [JsonPropertyName("priority")]
        public string Priority { get; set; }

        [JsonPropertyName("products")]
        public List<Product> Products { get; set; } = new();

        [JsonPropertyName("budget")]
        public decimal Budget { get; set; }

        [JsonPropertyName("costCenter")]
        public string CostCenter { get; set; }

        [JsonPropertyName("attachments")]
        public List<Attachment> Attachments { get; set; } = new();

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}