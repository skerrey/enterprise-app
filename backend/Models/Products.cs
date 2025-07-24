namespace backend.Models
{
    public class Product
    {
        public int id { get; set; }
        public string label { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; } 
        public decimal total { get; set; }
    }
}