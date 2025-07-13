using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        //private static readonly List<Request> requests = new();
        private static readonly string dataPath = Path.Combine(AppContext.BaseDirectory, "data", "requests.json");
        private static List<Request> requests = LoadRequestsFromFile();

        private static List<Request> LoadRequestsFromFile()
        {
            if (!System.IO.File.Exists(dataPath)) return new List<Request>();

            var json = System.IO.File.ReadAllText(dataPath);
            return JsonSerializer.Deserialize<List<Request>>(json) ?? new List<Request>();
        }

        private static void SaveRequestsToFile()
        {
            var json = JsonSerializer.Serialize(requests, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(dataPath, json);
        }

        [HttpPost]
        public IActionResult CreateRequest([FromBody] Request request)
        {
            request.Id = requests.Count + 1;
            requests.Add(request);
            SaveRequestsToFile();
            return Ok(request);
        }

        [HttpGet]
        public IActionResult GetAllRequests()
        {
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public IActionResult GetRequestById(int id)
        {
            var request = requests.FirstOrDefault(r => r.Id == id);
            if (request == null) return NotFound();
            return Ok(request);
        }
    }
}
