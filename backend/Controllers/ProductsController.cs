using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = new[]
            {
                new { Id = 1, Name = "Laptop", Price = 1299.99 },
                new { Id = 2, Name = "Phone", Price = 799.99 },
                new { Id = 3, Name = "Tablet", Price = 499.99 },
                new { Id = 4, Name = "Smartwatch", Price = 199.99 },
            };

            var test = new[]
            {
                new { id = 1, label = "test 1" },
                new { id = 2, label = "test 2" },
                new { id = 3, label = "test 3" },
            };

            var testString = "testString";

            return Ok(testString);
        }
    }
}
