using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CostCenters : ControllerBase
    {
        private static readonly string dataPath =
            Path.Combine(AppContext.BaseDirectory, "data", "cost-centers.json");

        [HttpGet]
        public IActionResult GetAll()
        {
            if (!System.IO.File.Exists(dataPath))
                return Ok(Array.Empty<object>());

            var json = System.IO.File.ReadAllText(dataPath);
            var list = JsonSerializer.Deserialize<object[]>(json);
            return Ok(list);
        }
    }
}
