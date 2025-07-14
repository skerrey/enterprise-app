using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly string dataPath =
      Path.Combine(AppContext.BaseDirectory, "data", "products.json");

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
