namespace backend.Models
{
    public class Request
    {
        public int Id { get; set; }
        public string ClientName { get; set; }
        public string Email { get; set; }
        public string SelectedProduct { get; set; }
        public string Notes { get; set; }
        public string AttachmentUrl { get; set; } // Optional: file path or blob URL
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
