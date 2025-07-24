using backend.Models;

namespace backend.Models
{
    public class Request
    {
        public int Id { get; set; }
        public string RequestorName { get; set; }
        public string RequestorEmail { get; set; }
        public string Department { get; set; }
        public string EmployeeID { get; set; }
        public string? OnBehalfOf { get; set; }
        public string RequestTitle { get; set; }
        public string Description { get; set; }
        public string RequestedDate { get; set; }
        public string? DueDate { get; set; }
        public string Priority { get; set; }
        public List<Product> Products { get; set; } = new();
        public decimal Budget { get; set; }
        public string CostCenter { get; set; }
        public List<Attachment> Attachments { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}